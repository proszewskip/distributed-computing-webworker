using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Services;
using Server.Models;

namespace Server.Controllers
{
    [HttpReadOnly]
    public class SubtaskController : JsonApiController<Subtask>
    {
        public SubtaskController(
            IJsonApiContext jsonApiContext,
            IResourceService<Subtask> resourceService
        ) : base(jsonApiContext, resourceService)
        {
        }
    }
}
