using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.Filters;
using Server.Models;

namespace Server.Controllers
{
    /// <summary>
    /// Controller responsible for managing subtasks.
    /// </summary>
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
