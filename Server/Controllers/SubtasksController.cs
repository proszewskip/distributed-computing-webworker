using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.Filters;
using Server.Models;

namespace Server.Controllers
{
    [HttpReadOnly]
    [ServiceFilter(typeof(FormatErrorActionFilter))]
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
