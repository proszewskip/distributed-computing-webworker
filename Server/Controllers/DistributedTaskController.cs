using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DTO;
using Server.Models;
using Server.Pagination;
using Server.Services;
using Server.Validation;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DistributedTaskController : Controller
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly ISubtaskFactoryFactory _subtaskFactoryFactory;
        private readonly IAssemblyLoader _assemblyLoader;
        private readonly IPathsProvider _pathsProvider;
        private readonly IAssemblyAnalyzer _assemblyAnalyzer;


        public DistributedTaskController(
            DistributedComputingDbContext dbContext,
            ISubtaskFactoryFactory subtaskFactoryFactory,
            IAssemblyLoader assemblyLoader,
            IPathsProvider pathsProvider,
            IAssemblyAnalyzer assemblyAnalyzer
        )
        {
            _dbContext = dbContext;
            _subtaskFactoryFactory = subtaskFactoryFactory;
            _assemblyLoader = assemblyLoader;
            _pathsProvider = pathsProvider;
            _assemblyAnalyzer = assemblyAnalyzer;
        }

        [HttpGet]
        public IEnumerable<DistributedTask> Get([FromQuery] QueryArgsBase queryArgs)
        {
            return _dbContext.DistributedTasks
                .Paginate(queryArgs);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var foundTask = _dbContext.DistributedTasks
                .Include(task => task.DistributedTaskDefinition)
                .Include(task => task.Subtasks)
                .FirstOrDefault(task => task.Id == id);

            if (foundTask == null) return NotFound();

            return Ok(foundTask);
        }

        [HttpPost]
        [ValidateModel]
        public IActionResult Create([FromBody] CreateDistributedTaskDTO body)
        {
            // FIXME: handle errors

            var taskDefinition = _dbContext.DistributedTaskDefinitions
                .FirstOrDefault(taskDef => taskDef.Id == body.DistributedTaskDefinitionId);

            if (taskDefinition == null)
            {
                ModelState.TryAddModelError(
                    nameof(body.DistributedTaskDefinitionId),
                    $"A task definition with id {body.DistributedTaskDefinitionId} does not exist."
                );

                return new ValidationFailedResult(ModelState);
            }

            var taskExists = _dbContext.DistributedTasks.Any(task => task.Name == body.Name);

            if (taskExists)
            {
                ModelState.TryAddModelError(
                    nameof(body.Name),
                    $"A task with name {body.Name} already exists."
                );

                return new ValidationFailedResult(ModelState);
            }


            var distributedTask = new DistributedTask
            {
                Name = body.Name,
                Priority = body.Priority,
                DistributedTaskDefinitionId = body.DistributedTaskDefinitionId,
                InputData = body.InputData,
                Status = DistributedTaskStatus.InProgress
            };

            if (body.Description != null)
                distributedTask.Description = body.Description;

            _dbContext.DistributedTasks.Add(distributedTask);

            var subtaskFactory = _subtaskFactoryFactory.CreateSubtaskFactory(distributedTask.Id);
            var distributedTaskDllPath = Path.Combine(
                _pathsProvider.TaskDefinitionsDirectoryPath,
                taskDefinition.DefinitionGuid.ToString(),
                taskDefinition.MainDllName
            );

            var taskAssembly = _assemblyLoader.LoadAssembly(distributedTaskDllPath);
            var taskInstance = _assemblyAnalyzer.InstantiateTask(taskAssembly);
            try
            {
                taskInstance.DefineTasks(body.InputData, subtaskFactory);
            }
            catch
            {
                // TODO: handle errors resulting from defining tasks
            }

            _dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = distributedTask.Id }, distributedTask);
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public IActionResult Put(int id, [FromBody] ModifyDistributedTaskDTO body)
        {
            // 1. Validate input data

            var modifiedTask = _dbContext.DistributedTasks.FirstOrDefault(task => task.Id == id);

            if (modifiedTask == null)
            {
                ModelState.TryAddModelError(
                    nameof(id),
                    $"A task with id {id} does not exist."
                );

                return new ValidationFailedResult(ModelState);
            }

            if (body.Name != null)
            {
                var taskExists = _dbContext.DistributedTasks.Any(task => task.Name == body.Name);

                if (taskExists)
                {
                    ModelState.TryAddModelError(
                        nameof(body.Name),
                        $"A task definition with name {body.Name} already exists."
                    );

                    return new ValidationFailedResult(ModelState);
                }

                modifiedTask.Name = body.Name;
            }

            if (body.Description != null)
            {
                modifiedTask.Description = body.Description;
            }

            _dbContext.SaveChanges();

            return Ok(modifiedTask);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var modifiedTask = _dbContext.DistributedTasks.FirstOrDefault(task => task.Id == id);

            if (modifiedTask == null)
            {
                ModelState.TryAddModelError(
                    nameof(id),
                    $"A task with id {id} does not exist."
                );

                return new ValidationFailedResult(ModelState);
            }

            //TODO: update ModelBuilder to delete subtasks when task is deleted
            _dbContext.DistributedTasks.Remove(modifiedTask);
            _dbContext.SaveChanges();

            return Ok();
        }
    }
}
