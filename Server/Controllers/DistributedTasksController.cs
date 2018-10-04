using System.IO;
using System.Text;
using System.Threading.Tasks;
using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.DTO;
using Server.Models;
using Server.Validation;

namespace Server.Controllers
{
    public class DistributedTasksController : JsonApiController<DistributedTask>
    {
        private readonly IResourceService<DistributedTask> _distributedTaskResourceService;
        private readonly IJsonApiSerializer _jsonApiSerializer;

        public DistributedTasksController(
            IJsonApiContext jsonApiContext,
            IResourceService<DistributedTask> distributedTaskResourceService,
            ILoggerFactory loggerFactory,
            IJsonApiSerializer jsonApiSerializer
        ) : base(jsonApiContext, distributedTaskResourceService, loggerFactory)
        {
            _distributedTaskResourceService = distributedTaskResourceService;
            _jsonApiSerializer = jsonApiSerializer;
        }

        [HttpPost("add")]
        [ValidateModel]
        public async Task PostAsync([FromForm] CreateDistributedTaskDTO body)
        {
            var distributedTask = new DistributedTask
            {
                DistributedTaskDefinitionId = body.DistributedTaskDefinitionId,
                Priority = body.Priority,
                Name = body.Name,
                Description = body.Description,
                InputData = new byte[body.InputData.Length],
                TrustLevelToComplete = body.TrustLevelToComplete,
            };

            var memoryStream = new MemoryStream(distributedTask.InputData);
            await body.InputData.CopyToAsync(memoryStream);

            var createdDistributedTask = await _distributedTaskResourceService.CreateAsync(distributedTask);

            var serializedResult = _jsonApiSerializer.Serialize(createdDistributedTask);

            HttpContext.Response.ContentType = Constants.ContentType;
            HttpContext.Response.StatusCode = 201;
            await HttpContext.Response.Body.WriteAsync(Encoding.UTF8.GetBytes(serializedResult));
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
    }
}
