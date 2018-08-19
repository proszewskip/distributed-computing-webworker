using System;
using System.Reflection;
using System.Threading.Tasks;
using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyModel.Resolution;
using Microsoft.Extensions.Logging;
using Server.DTO;
using Server.Exceptions;
using Server.Models;
using Server.Services;
using Server.Validation;

namespace Server.Controllers
{
    public class DistributedTaskDefinitionsController : JsonApiController<DistributedTaskDefinition>
    {
        private readonly IProblemPluginFacadeFactory _problemPluginFacadeFactory;
        private readonly IAssemblyLoader _assemblyLoader;
        private readonly IFileStorage _fileStorage;
        private readonly IPackager _packager;
        private readonly IPathsProvider _pathsProvider;
        private readonly ILogger<DistributedTaskDefinitionsController> _logger;


        public DistributedTaskDefinitionsController(
            IJsonApiContext jsonApiContext,
            IResourceService<DistributedTaskDefinition> resourceService,
            ILoggerFactory loggerFactory,
            IPathsProvider pathsProvider,
            IProblemPluginFacadeFactory problemPluginFacadeFactory,
            IAssemblyLoader assemblyLoader,
            IFileStorage fileStorage
        ) : base(jsonApiContext, resourceService, loggerFactory)
        {
            _pathsProvider = pathsProvider;
            _problemPluginFacadeFactory = problemPluginFacadeFactory;
            _assemblyLoader = assemblyLoader;
            _fileStorage = fileStorage;

            _logger = loggerFactory.CreateLogger<DistributedTaskDefinitionsController>();
        }

        // TODO: come up with a better name for the endpoint
        [HttpPost("add")]
        [ValidateModel]
        public async Task<IActionResult> PostAsync([FromForm] CreateDistributedTaskDefinitionDTO body)
        {
            var taskDefinitionGuid = Guid.NewGuid();
            var mainDllPath = await SaveDllsAsync(body, taskDefinitionGuid);
            var mainDllAssembly = _assemblyLoader.LoadAssembly(mainDllPath);
            ProblemPluginInfo problemPluginInfo;

            try
            {
                problemPluginInfo = AnalyzeAssembly(mainDllAssembly);
            }
            catch (InvalidAssemblyException exception)
            {
                DeleteSavedDlls(taskDefinitionGuid);
                return Error(new Error(400, exception.Message));
            }
            catch (Exception exception)
            {
                DeleteSavedDlls(taskDefinitionGuid);
                _logger.LogWarning(exception, "Exception occurred when analyzing the assembly");
                return Error(new Error(500, "Internal Server Error when analyzing the assembly"));
            }


            // TODO: handle packager errors and display them to the user
            await PackAssemblyAsync(body, taskDefinitionGuid);

            var distributedTaskDefinition = new DistributedTaskDefinition
            {
                Name = body.Name,
                Description = body.Description,
                DefinitionGuid = taskDefinitionGuid,
                ProblemPluginInfo = problemPluginInfo,
                MainDllName = body.MainDll.FileName
            };

            try
            {
                return await base.PostAsync(distributedTaskDefinition);
            }
            catch
            {
                DeleteSavedDlls(taskDefinitionGuid);
                DeletePackagerResults(taskDefinitionGuid);
                throw;
            }
        }

        private Task PackAssemblyAsync(CreateDistributedTaskDefinitionDTO body, Guid taskDefinitionGuid)
        {
            string[] args =
            {
                $"-prefix={_pathsProvider.GetTaskDefinitionDirectoryPath(taskDefinitionGuid)}",
                $"-out={_pathsProvider.GetCompiledTaskDefinitionDirectoryPath(taskDefinitionGuid)}",
                body.MainDll.FileName
            };

            return Task.Run(() => _packager.Run(args));
        }

        private async Task<string> SaveDllsAsync(CreateDistributedTaskDefinitionDTO body, Guid taskDefinitionGuid)
        {
            var taskDefinitionDirectoryPath = _pathsProvider.GetTaskDefinitionDirectoryPath(taskDefinitionGuid);
            var saveMainDllFileTask = _fileStorage.SaveFileAsync(taskDefinitionDirectoryPath, body.MainDll);

            await Task.WhenAll(saveMainDllFileTask,
                _fileStorage.SaveFilesAsync(taskDefinitionDirectoryPath, body.AdditionalDlls));

            return saveMainDllFileTask.Result;
        }

        private void DeleteSavedDlls(Guid taskDefinitionGuid)
        {
            var taskDefinitionDirectoryPath = _pathsProvider.GetTaskDefinitionDirectoryPath(taskDefinitionGuid);
            _fileStorage.DeleteDirectory(taskDefinitionDirectoryPath);
        }

        private void DeletePackagerResults(Guid taskDefinitionGuid)
        {
            var packagerResultsDirectoryPath =
                _pathsProvider.GetCompiledTaskDefinitionDirectoryPath(taskDefinitionGuid);
            _fileStorage.DeleteDirectory(packagerResultsDirectoryPath);
        }

        private ProblemPluginInfo AnalyzeAssembly(Assembly assembly)
        {
            var problemPluginFacade = _problemPluginFacadeFactory.Create(assembly);

            return problemPluginFacade.GetProblemPluginInfo();
        }
    }
}