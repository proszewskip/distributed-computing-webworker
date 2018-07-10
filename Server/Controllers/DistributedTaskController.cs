using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DTO;
using Server.Models;
using Server.Pagination;
using Server.Validation;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DistributedTaskController : ControllerBase
    {
        private readonly DistributedComputingDbContext _dbContext;


        public DistributedTaskController(
            DistributedComputingDbContext dbContext
        )
        {
            _dbContext = dbContext;
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
        public IActionResult Create([FromForm] CreateDistributedTaskDTO body)
        {
            // FIXME: handle errors

            // 1. Validate input data
            var taskDefinitionExists = _dbContext.DistributedTaskDefinitions
                .Any(taskDefinition => taskDefinition.Id == body.DistributedTaskDefinitionId);

            if (!taskDefinitionExists)
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


            // TODO: 2. Create subtasks

            // TODO: 3. Run subtasks

            // TODO: Include subtasks
            // 4. Add the data to the database

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

            _dbContext.SaveChanges();

            // 5. Return the info back to the user

            return Ok(distributedTask);
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public IActionResult Put(int id, [FromForm] ModifyDistributedTaskDTO body)
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

            //TODO: update ModelBuilder to delete subtasks when task is deleted
            // 2. Remove task
            _dbContext.DistributedTasks.Remove(modifiedTask);

            _dbContext.SaveChanges();

            // 3. Return the info back to the user

            return Ok();
        }
    }
}
