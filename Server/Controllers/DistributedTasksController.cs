using System.IO;
using System.Threading.Tasks;
using JsonApiDotNetCore.Controllers;
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
        public DistributedTasksController(
            IJsonApiContext jsonApiContext,
            IResourceService<DistributedTask> resourceService,
            ILoggerFactory loggerFactory
        ) : base(jsonApiContext, resourceService, loggerFactory)
        {
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
    }
}
