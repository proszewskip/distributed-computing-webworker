using System.Threading.Tasks;
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
        private readonly IResourceService<Subtask> _subtaskResourceService;

        public SubtasksController(
            IJsonApiContext jsonApiContext,
            IResourceService<Subtask> subtaskResourceService,
            ILoggerFactory loggerFactory
        ) : base(jsonApiContext, subtaskResourceService, loggerFactory)
        {
            _subtaskResourceService = subtaskResourceService;
        }


        [HttpGet("{id}/input-data")]
        public async Task<IActionResult> DownloadInputData(int id)
        {
            var subtask = await _subtaskResourceService.GetAsync(id);

            if (subtask == null)
                return NotFound();

            return File(subtask.InputData, "application/octet-stream", $"{subtask.Id}-input-data");
        }
    }
}
