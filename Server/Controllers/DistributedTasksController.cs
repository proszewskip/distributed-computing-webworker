using System.IO;
using System.Text;
using System.Threading.Tasks;
using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSwag.Annotations;
using Server.DTO;
using Server.Filters;
using Server.Models;
using Server.Services;
using Server.Validation;

namespace Server.Controllers
{
    /// <summary>
    /// Controller responsible for managing distributed tasks
    /// </summary>
    [ServiceFilter(typeof(FormatErrorActionFilter))]
    [ServiceFilter(typeof(AuthorizationFilter))]
    public class DistributedTasksController : JsonApiController<DistributedTask>
    {
        private readonly IResourceService<DistributedTask> _distributedTaskResourceService;
        private readonly IJsonApiResponseFactory _jsonApiResponseFactory;

        public DistributedTasksController(
            IJsonApiContext jsonApiContext,
            IResourceService<DistributedTask> distributedTaskResourceService,
            ILoggerFactory loggerFactory,
            IJsonApiResponseFactory jsonApiResponseFactory
        ) : base(jsonApiContext, distributedTaskResourceService, loggerFactory)
        {
            _distributedTaskResourceService = distributedTaskResourceService;
            _jsonApiResponseFactory = jsonApiResponseFactory;
        }

        [HttpPost("add")]
        [ValidateModel]
        public async Task<IActionResult> PostAsync([FromForm] CreateDistributedTaskDTO body)
        {
            var distributedTask = new DistributedTask
            {
                DistributedTaskDefinitionId = body.DistributedTaskDefinitionId,
                Priority = body.Priority,
                Name = body.Name,
                Description = body.Description ?? "",
                InputData = new byte[body.InputData.Length],
                TrustLevelToComplete = body.TrustLevelToComplete,
            };

            var memoryStream = new MemoryStream(distributedTask.InputData);
            await body.InputData.CopyToAsync(memoryStream);

            var createdDistributedTask = await _distributedTaskResourceService.CreateAsync(distributedTask);

            HttpContext.Response.StatusCode = 201;
            return await _jsonApiResponseFactory.CreateResponseAsync(HttpContext.Response, createdDistributedTask);
        }

        [HttpGet("{id}/input-data")]
        public async Task<IActionResult> DownloadInputData(int id)
        {
            var distributedTask = await _distributedTaskResourceService.GetAsync(id);

            if (distributedTask == null)
                return NotFound();

            return File(distributedTask.InputData, "application/octet-stream", $"{distributedTask.Name}-input-data");
        }

        [HttpGet("{id}/result")]
        public async Task<IActionResult> DownloadResult(int id)
        {
            var distributedTask = await _distributedTaskResourceService.GetAsync(id);

            if (distributedTask == null)
                return NotFound();

            if (distributedTask.Result == null)
                return Error(new Error(400, "The result is currently not available."));

            return File(distributedTask.Result, "application/octet-stream", $"{distributedTask.Name}-result");
        }

        // This method is added only to remove it from the documentation
        [SwaggerIgnore]
        public override async Task<IActionResult> PostAsync(DistributedTask entity) => await base.PostAsync(entity);
    }
}
