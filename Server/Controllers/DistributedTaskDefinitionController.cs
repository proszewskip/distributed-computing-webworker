using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Server.DTO;
using Server.Models;
using Server.Pagination;
using Server.Services;
using Server.Services.AssemblyAnalyzer;
using Server.Services.PathsProvider;
using Server.Validation;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DistributedTaskDefinitionController : ControllerBase
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IPathsProvider _pathsProvider;
        private readonly IAssemblyAnalyzer _assemblyAnalyzer;
        // TODO: use IPackagerRunner instead of PackagerRunner
        private readonly PackagerRunner _packagerRunner;


        public DistributedTaskDefinitionController(
            DistributedComputingDbContext dbContext,
            IPathsProvider pathsProvider,
            IAssemblyAnalyzer assemblyAnalyzer,
            PackagerRunner packagerRunner
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
            var taskDefinitionDirectoryPath = Path.Join(
                _pathsProvider.TaskDefinitionsDirectoryPath,
                taskDefinitionGuid.ToString()
            );

            Directory.CreateDirectory(taskDefinitionDirectoryPath);

            // REFACTOR: extract saving the DLLs
            var mainDllPath = Path.Join(taskDefinitionDirectoryPath, body.MainDll.FileName);
            using (var mainDllFileStream = new FileStream(mainDllPath, FileMode.Create))
            {
                await body.MainDll.CopyToAsync(mainDllFileStream);
            }

            foreach (var additionalDllFile in body.AdditionalDlls)
            {
                var additionalDllPath = Path.Join(taskDefinitionDirectoryPath, additionalDllFile.FileName);
                using (var additionalDllFileStream = new FileStream(additionalDllPath, FileMode.Create))
                {
                    await additionalDllFile.CopyToAsync(additionalDllFileStream);
                }
            }

            var mainDllAssembly = Assembly.LoadFrom(mainDllPath);
            var subtaskInfo = _assemblyAnalyzer.GetSubtaskInfo(mainDllAssembly);

            // 3. Run packager
            // TODO: display the result of packager
            await _packagerRunner.PackAssemblyAsync(taskDefinitionGuid.ToString(), body.MainDll.FileName);

            // 4. Add the data to the database
            var distributedTaskDefinition = new DistributedTaskDefinition()
            {
                Name = body.Name,
                OutputDirectory = Path.Combine(
                    _pathsProvider.CompiledTasksDefinitionsDirectoryPath,
                    taskDefinitionGuid.ToString(),
                    body.MainDll.FileName
                ),
                SubtaskInfo = subtaskInfo
            };

            _dbContext.DistributedTaskDefinitions.Add(distributedTaskDefinition);
            _dbContext.SaveChanges();

            // 5. Return the info back to the user

            return Ok(distributedTaskDefinition);
        }
    }
}
