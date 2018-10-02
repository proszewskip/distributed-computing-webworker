using System.IO;
using System.Threading.Tasks;
using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.DTO;
using Server.Exceptions;
using Server.Models;
using Server.Validation;

namespace Server.Controllers
{
    public class DistributedTasksController : JsonApiController<DistributedTask>
    {
        private readonly IResourceService<DistributedTask, int> _resourceService;

        public DistributedTasksController(
            IJsonApiContext jsonApiContext,
            IResourceService<DistributedTask> resourceService,
            ILoggerFactory loggerFactory
        ) : base(jsonApiContext, resourceService, loggerFactory)
        {
            _resourceService = resourceService;
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
                Description = body.Description,
                InputData = new byte[body.InputData.Length],
                TrustLevelToComplete = body.TrustLevelToComplete,
            };

            var memoryStream = new MemoryStream(distributedTask.InputData);
            await body.InputData.CopyToAsync(memoryStream);

            return await base.PostAsync(distributedTask);
        }

        [HttpGet("{id}/input-data")]
        public async Task<IActionResult> DownloadInputData(int id)
        {
            var distributedTask = await _resourceService.GetAsync(id);

            if (distributedTask == null)
                return NotFound();

            return File(distributedTask.InputData, "application/octet-stream", $"{distributedTask.Name}-input-data");
        }

        [HttpGet("{id}/result")]
        public async Task<IActionResult> DownloadResult(int id)
        {
            var distributedTask = await _resourceService.GetAsync(id);

            if (distributedTask == null)
                return NotFound();

            if (distributedTask.Result == null)
            {
                throw new NullResultException();
            }

            return File(distributedTask.Result, "application/octet-stream", $"{distributedTask.Name}-result");
        }
    }
}
