using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Services;
using Microsoft.Extensions.Logging;
using Server.Models;

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
    }
}
