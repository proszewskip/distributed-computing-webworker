using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using DistributedComputing.Common;
using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.DTO;
using Server.Models;
using Server.Pagination;
using Server.Services;
using Server.Validation;

namespace Server.Controllers
{
    public class DistributedTaskDefinitionController : JsonApiController<DistributedTaskDefinition>
    {
        private readonly IAssemblyAnalyzer _assemblyAnalyzer;
        private readonly IPackagerRunner _packagerRunner;
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IPathsProvider _pathsProvider;


        public DistributedTaskDefinitionController(
            IJsonApiContext jsonApiContext,
            IResourceService<DistributedTaskDefinition> resourceService,
            DistributedComputingDbContext dbContext,
            ILoggerFactory loggerFactory,
            IPathsProvider pathsProvider,
            IAssemblyAnalyzer assemblyAnalyzer,
            IPackagerRunner packagerRunner
        ) : base(jsonApiContext, resourceService, loggerFactory)
        {
            _dbContext = dbContext;
            _pathsProvider = pathsProvider;
            _assemblyAnalyzer = assemblyAnalyzer;
            _packagerRunner = packagerRunner;
        }

        // TODO: come up with a better name for the endpoint
        [HttpPost("add")]
        [ValidateModel]
        public async Task<IActionResult> PostAsync([FromForm] CreateDistributedTaskDefinitionDTO body)
        {
            // FIXME: handle errors

            // 1. Validate input data
            var taskDefinitionExists = await _dbContext.DistributedTaskDefinitions
                .AnyAsync(taskDefinition => taskDefinition.Name == body.Name);

            if (taskDefinitionExists)
            {
                return Error(new Error(400, $"A task definition with the name {body.Name} already exists"));
            }

            // 2. Analyze the DLL
            var taskDefinitionGuid = Guid.NewGuid();
            var mainDllPath = await SaveDlls(body, taskDefinitionGuid);

            var mainDllAssembly = Assembly.LoadFrom(mainDllPath);
            // TODO: handle errors while creating subtaskInfo
            var subtaskInfo = _assemblyAnalyzer.GetSubtaskInfo(mainDllAssembly);
            try
            {
                _assemblyAnalyzer.InstantiateTask(mainDllAssembly);
            }
            catch
            {
                return Error(new Error(400,
                    $"Cannot instantiate a task. Make sure the assembly contains a class that implements the {nameof(ITask)} interface"));
            }

            // 3. Run packager
            // TODO: handle packager errors and display them to the user
            var packagerResults =
                await _packagerRunner.PackAssemblyAsync(taskDefinitionGuid.ToString(), body.MainDll.FileName);

            // 4. Add the data to the database
            var distributedTaskDefinition = new DistributedTaskDefinition
            {
                Name = body.Name,
                Description = body.Description,
                DefinitionGuid = taskDefinitionGuid,
                SubtaskInfo = subtaskInfo,
                MainDllName = body.MainDll.FileName
            };

            // TODO: handle PostAsync errors, remove saved DLL files when they occur
            return await base.PostAsync(distributedTaskDefinition);
        }

        private async Task<string> SaveDlls(CreateDistributedTaskDefinitionDTO body, Guid taskDefinitionGuid)
        {
            // TODO: extract computing paths to PathsProvider
            var taskDefinitionDirectoryPath = Path.Combine(
                _pathsProvider.TaskDefinitionsDirectoryPath,
                taskDefinitionGuid.ToString()
            );

            Directory.CreateDirectory(taskDefinitionDirectoryPath);

            // TODO: extract saving the DLLs
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

            return mainDllPath;
        }
    }
}
