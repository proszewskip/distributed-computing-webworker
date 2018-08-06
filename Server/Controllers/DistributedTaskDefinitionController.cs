using System;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using DistributedComputing.Common;
using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.DTO;
using Server.Exceptions;
using Server.Models;
using Server.Services;
using Server.Validation;

namespace Server.Controllers
{
    public class DistributedTaskDefinitionController : JsonApiController<DistributedTaskDefinition>
    {
        private readonly IAssemblyAnalyzer _assemblyAnalyzer;
        private readonly IAssemblyLoader _assemblyLoader;
        private readonly IPackagerRunner _packagerRunner;
        private readonly IFileStorage _fileStorage;
        private readonly IPathsProvider _pathsProvider;
        private readonly ILogger<DistributedTaskDefinitionController> _logger;


        public DistributedTaskDefinitionController(
            IJsonApiContext jsonApiContext,
            IResourceService<DistributedTaskDefinition> resourceService,
            ILoggerFactory loggerFactory,
            IPathsProvider pathsProvider,
            IAssemblyAnalyzer assemblyAnalyzer,
            IAssemblyLoader assemblyLoader,
            IPackagerRunner packagerRunner,
            IFileStorage fileStorage
        ) : base(jsonApiContext, resourceService, loggerFactory)
        {
            _pathsProvider = pathsProvider;
            _assemblyAnalyzer = assemblyAnalyzer;
            _assemblyLoader = assemblyLoader;
            _packagerRunner = packagerRunner;
            _fileStorage = fileStorage;

            _logger = loggerFactory.CreateLogger<DistributedTaskDefinitionController>();
        }

        // TODO: come up with a better name for the endpoint
        [HttpPost("add")]
        [ValidateModel]
        public async Task<IActionResult> PostAsync([FromForm] CreateDistributedTaskDefinitionDTO body)
        {
            var taskDefinitionGuid = Guid.NewGuid();
            var mainDllPath = await SaveDllsAsync(body, taskDefinitionGuid);
            var mainDllAssembly = _assemblyLoader.LoadAssembly(mainDllPath);
            SubtaskInfo subtaskInfo;

            try
            {
                subtaskInfo = AnalyzeAssembly(mainDllAssembly);
            }
            catch (InvalidAssemblyException exception)
            {
                return Error(new Error(400, exception.Message));
            }
            catch (Exception exception)
            {
                _logger.LogWarning(exception, "Exception occurred when analyzing the assembly");
                return Error(new Error(500, "Internal Server Error when analyzing the assembly"));
            }

            
            // TODO: handle packager errors and display them to the user
            var assemblyPackingResult = await PackAssemblyAsync(body, taskDefinitionGuid);

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

        private Task<CommandRunnerResult> PackAssemblyAsync(CreateDistributedTaskDefinitionDTO body, Guid taskDefinitionGuid)
        {
            return _packagerRunner.PackAssemblyAsync(_pathsProvider.GetTaskDefinitionDirectoryPath(taskDefinitionGuid), _pathsProvider.GetCompiledTaskDefinitionDirectoryPath(taskDefinitionGuid), body.MainDll.FileName);
        }

        private async Task<string> SaveDllsAsync(CreateDistributedTaskDefinitionDTO body, Guid taskDefinitionGuid)
        {
            var taskDefinitionDirectoryPath = _pathsProvider.GetTaskDefinitionDirectoryPath(taskDefinitionGuid);
            var saveMainDllFileTask = _fileStorage.SaveFileAsync(taskDefinitionDirectoryPath, body.MainDll);

            await Task.WhenAll(saveMainDllFileTask,
                _fileStorage.SaveFilesAsync(taskDefinitionDirectoryPath, body.AdditionalDlls));

            return saveMainDllFileTask.Result;
        }

        private SubtaskInfo AnalyzeAssembly(Assembly assembly)
        {
            _assemblyAnalyzer.InstantiateTask(assembly);
            return _assemblyAnalyzer.GetSubtaskInfo(assembly);
        }
    }
}
