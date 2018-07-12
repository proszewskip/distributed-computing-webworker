using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
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
    public class DistributedTaskDefinitionController : Controller
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IPathsProvider _pathsProvider;
        private readonly IAssemblyAnalyzer _assemblyAnalyzer;
        private readonly IPackagerRunner _packagerRunner;


        public DistributedTaskDefinitionController(
            DistributedComputingDbContext dbContext,
            IPathsProvider pathsProvider,
            IAssemblyAnalyzer assemblyAnalyzer,
            IPackagerRunner packagerRunner
        )
        {
            _dbContext = dbContext;
            _pathsProvider = pathsProvider;
            _assemblyAnalyzer = assemblyAnalyzer;
            _packagerRunner = packagerRunner;
        }

        [HttpGet]
        public IEnumerable<DistributedTaskDefinition> Get([FromQuery] QueryArgsBase queryArgs)
        {
            return _dbContext.DistributedTaskDefinitions
                .Paginate(queryArgs);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var foundTaskDefinition = _dbContext.DistributedTaskDefinitions
                .Include(taskDefinition => taskDefinition.SubtaskInfo)
                .FirstOrDefault(taskDefinition => taskDefinition.Id == id);

            if (foundTaskDefinition == null)
            {
                return NotFound();
            }

            return Ok(foundTaskDefinition);
        }

        [HttpPost]
        [ValidateModelAttribute]
        public async Task<IActionResult> Create([FromForm] CreateDistributedTaskDefinitionDTO body)
        {
            // FIXME: handle errors

            // 1. Validate input data
            var taskDefinitionExists = _dbContext.DistributedTaskDefinitions
                .Any(taskDefinition => taskDefinition.Name == body.Name);

            if (taskDefinitionExists)
            {
                ModelState.TryAddModelError(
                    nameof(body.Name),
                    $"A task definition with name {body.Name} already exists"
                );

                return new ValidationFailedResult(ModelState);
            }

            // 2. Analyze the DLL
            var taskDefinitionGuid = Guid.NewGuid();
            var taskDefinitionDirectoryPath = Path.Combine(
                _pathsProvider.TaskDefinitionsDirectoryPath,
                taskDefinitionGuid.ToString()
            );

            Directory.CreateDirectory(taskDefinitionDirectoryPath);

            // REFACTOR: extract saving the DLLs
            var mainDllPath = Path.Combine(taskDefinitionDirectoryPath, body.MainDll.FileName);
            using (var mainDllFileStream = new FileStream(mainDllPath, FileMode.Create))
            {
                await body.MainDll.CopyToAsync(mainDllFileStream);
            }

            foreach (var additionalDllFile in body.AdditionalDlls)
            {
                var additionalDllPath = Path.Combine(taskDefinitionDirectoryPath, additionalDllFile.FileName);
                using (var additionalDllFileStream = new FileStream(additionalDllPath, FileMode.Create))
                {
                    await additionalDllFile.CopyToAsync(additionalDllFileStream);
                }
            }

            var mainDllAssembly = Assembly.LoadFrom(mainDllPath);
            var subtaskInfo = _assemblyAnalyzer.GetSubtaskInfo(mainDllAssembly);

            // 3. Run packager
            var packagerResults = await _packagerRunner.PackAssemblyAsync(taskDefinitionGuid.ToString(), body.MainDll.FileName);

            // 4. Add the data to the database
            var distributedTaskDefinition = new DistributedTaskDefinition()
            {
                Name = body.Name,
                Description = body.Description,
                DefinitionGuid = taskDefinitionGuid,
                SubtaskInfo = subtaskInfo
            };

            _dbContext.DistributedTaskDefinitions.Add(distributedTaskDefinition);
            _dbContext.SaveChanges();

            // 5. Return the info back to the user

            return CreatedAtAction(nameof(GetById), new { id = distributedTaskDefinition.Id }, new { distributedTaskDefinition, packagerResults });
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public IActionResult Put(int id, [FromBody] ModifyDistributedTaskDefinitionDTO body)
        {
            var modifiedTaskDefinition = _dbContext.DistributedTaskDefinitions.FirstOrDefault(task => task.Id == id);

            if (modifiedTaskDefinition == null)
            {
                ModelState.TryAddModelError(
                    nameof(id),
                    $"A task definition with id {id} does not exist."
                );

                return new ValidationFailedResult(ModelState);
            }

            if (body.Name != null)
            {
                var taskDefinitionExists = _dbContext.DistributedTaskDefinitions.Any(task => task.Name == body.Name);

                if (taskDefinitionExists)
                {
                    ModelState.TryAddModelError(
                        nameof(body.Name),
                        $"A task definition with name {body.Name} already exists."
                    );

                    return new ValidationFailedResult(ModelState);
                }

                modifiedTaskDefinition.Name = body.Name;
            }

            if (body.Description != null)
            {
                modifiedTaskDefinition.Description = body.Description;
            }

            _dbContext.SaveChanges();

            return Ok(modifiedTaskDefinition);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var modifiedTaskDefinition = _dbContext.DistributedTaskDefinitions.FirstOrDefault(task => task.Id == id);

            if (modifiedTaskDefinition == null)
            {
                ModelState.TryAddModelError(
                    nameof(id),
                    $"A task definition with id {id} does not exist."
                );

                return new ValidationFailedResult(ModelState);
            }

            // TODO: update ModelBuilder to delete tasks when the task definition is deleted
            _dbContext.DistributedTaskDefinitions.Remove(modifiedTaskDefinition);
            _dbContext.SaveChanges();

            return Ok();
        }
    }
}
