using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Services;
using Microsoft.Extensions.Logging;
using Server.Models;

namespace Server.Controllers
{
    [HttpReadOnly]
    public class SubtasksController : JsonApiController<Subtask>
    {
        public SubtasksController(
            IJsonApiContext jsonApiContext,
            IResourceService<Subtask> resourceService,
            ILoggerFactory loggerFactory
        ) : base(jsonApiContext, resourceService, loggerFactory)
        {
        }
    }
}
