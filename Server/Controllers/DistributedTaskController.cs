using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Services;
using Microsoft.Extensions.Logging;
using Server.Models;

namespace Server.Controllers
{
    public class DistributedTaskController : JsonApiController<DistributedTask>
    {
        public DistributedTaskController(
            IJsonApiContext jsonApiContext,
            IResourceService<DistributedTask> resourceService,
            ILoggerFactory loggerFactory
        ) : base(jsonApiContext, resourceService, loggerFactory)
        {
        }
    }
}
