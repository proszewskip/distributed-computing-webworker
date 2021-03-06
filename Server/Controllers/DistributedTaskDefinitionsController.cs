using System;
using System.Threading.Tasks;
using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSwag.Annotations;
using Server.DTO;
using Server.Exceptions;
using Server.Filters;
using Server.Models;
using Server.Services;
using Server.Validation;

namespace Server.Controllers
{
    /// <summary>
    /// Controller responsible for managing distributed task definitions.
    /// </summary>
    [ServiceFilter(typeof(FormatErrorActionFilter))]
    [ServiceFilter(typeof(AuthorizationFilter))]
    public class DistributedTaskDefinitionsController : JsonApiController<DistributedTaskDefinition>
    {
        private readonly IProblemPluginFacadeProvider _problemPluginFacadeProvider;
        private readonly IFileStorage _fileStorage;
        private readonly IPackager _packager;
        private readonly IJsonApiResponseFactory _jsonApiResponseFactory;
        private readonly IResourceService<DistributedTaskDefinition> _taskDefinitionResourceService;
        private readonly IPathsProvider _pathsProvider;
        private readonly ILogger<DistributedTaskDefinitionsController> _logger;


        public DistributedTaskDefinitionsController(
            IJsonApiContext jsonApiContext,
            IResourceService<DistributedTaskDefinition> taskDefinitionResourceService,
            ILoggerFactory loggerFactory,
            IPathsProvider pathsProvider,
            IProblemPluginFacadeProvider problemPluginFacadeProvider,
            IFileStorage fileStorage,
            IPackager packager,
            IJsonApiResponseFactory jsonApiResponseFactory
        ) : base(jsonApiContext, taskDefinitionResourceService, loggerFactory)
        {
            _taskDefinitionResourceService = taskDefinitionResourceService;
            _pathsProvider = pathsProvider;
            _problemPluginFacadeProvider = problemPluginFacadeProvider;
            _fileStorage = fileStorage;
            _packager = packager;
            _jsonApiResponseFactory = jsonApiResponseFactory;

            _logger = loggerFactory.CreateLogger<DistributedTaskDefinitionsController>();
        }

        [HttpPost("add")]
        [ValidateModel]
        public async Task<IActionResult> PostAsync([FromForm] CreateDistributedTaskDefinitionDTO body)
        {
            var taskDefinitionGuid = Guid.NewGuid();
            var mainDllName = body.MainDll.FileName;
            ProblemPluginInfo problemPluginInfo;

            await SaveDllsAsync(body, taskDefinitionGuid);

            try
            {
                problemPluginInfo = AnalyzeAssembly(taskDefinitionGuid, mainDllName);
            }
            catch (InvalidAssemblyException exception)
            {
                DeleteSavedDlls(taskDefinitionGuid);
                return Error(new Error(StatusCodes.Status400BadRequest, exception.Message, exception.InnerException?.Message));
            }
            catch (Exception exception)
            {
                DeleteSavedDlls(taskDefinitionGuid);
                _logger.LogWarning(exception, "Exception occurred when analyzing the assembly");
                return Error(new Error(StatusCodes.Status500InternalServerError, "Internal Server Error when analyzing the assembly"));
            }


            // TODO: handle packager errors and display them to the user
            var packagerLogs = await PackAssemblyAsync(taskDefinitionGuid, mainDllName);

            var distributedTaskDefinition = new DistributedTaskDefinition
            {
                Name = body.Name,
                Description = body.Description ?? "",
                DefinitionGuid = taskDefinitionGuid,
                ProblemPluginInfo = problemPluginInfo,
                MainDllName = mainDllName,
                PackagerLogs = packagerLogs
            };

            try
            {
                var createdTaskDefinition = await _taskDefinitionResourceService.CreateAsync(distributedTaskDefinition);
                HttpContext.Response.StatusCode = StatusCodes.Status201Created;

                return await _jsonApiResponseFactory.CreateResponseAsync(HttpContext.Response, createdTaskDefinition);
            }
            catch
            {
                DeleteSavedDlls(taskDefinitionGuid);
                DeletePackagerResults(taskDefinitionGuid);
                throw;
            }
        }

        // This method is added only to remove it from the documentation
        [SwaggerIgnore]
        public override async Task<IActionResult> PostAsync(DistributedTaskDefinition entity) => await base.PostAsync(entity);

        private Task<string> PackAssemblyAsync(Guid taskDefinitionGuid, string mainDllName)
        {
            string[] args =
            {
                $"--prefix={_pathsProvider.GetTaskDefinitionDirectoryPath(taskDefinitionGuid)}",
                $"--out={_pathsProvider.GetCompiledTaskDefinitionDirectoryPath(taskDefinitionGuid)}",
                mainDllName
            };

            return Task.Run(() => _packager.Run(args));
        }

        private Task SaveDllsAsync(CreateDistributedTaskDefinitionDTO body, Guid taskDefinitionGuid)
        {
            var taskDefinitionDirectoryPath = _pathsProvider.GetTaskDefinitionDirectoryPath(taskDefinitionGuid);

            var saveMainDllFileTask = _fileStorage.SaveFileAsync(taskDefinitionDirectoryPath, body.MainDll);
            var saveAdditionalDllsTask = _fileStorage.SaveFilesAsync(taskDefinitionDirectoryPath, body.AdditionalDlls);

            return Task.WhenAll(saveMainDllFileTask, saveAdditionalDllsTask);
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

        private ProblemPluginInfo AnalyzeAssembly(Guid taskDefinitionGuid, string mainDllName)
        {
            var problemPluginFacade = _problemPluginFacadeProvider.Provide(taskDefinitionGuid, mainDllName);

            return problemPluginFacade.GetProblemPluginInfo();
        }
    }
}
