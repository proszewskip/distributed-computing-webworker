using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Services;
using Server.Models;

namespace Server.Controllers
{
    [HttpReadOnly]
    public class SubtasksController : BaseJsonApiController<Subtask>
    {
        public SubtasksController(
            IJsonApiContext jsonApiContext,
            IResourceService<Subtask> resourceService
        ) : base(jsonApiContext, resourceService)
        {
        }
    }
}
