using System;
using System.Threading.Tasks;
using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.Models;

namespace Server.Controllers
{
    public class SubtaskController : JsonApiController<Subtask>
    {
        public SubtaskController(
            IJsonApiContext jsonApiContext,
            IResourceService<Subtask> resourceService
        ) : base(jsonApiContext, getAll: resourceService, getById: resourceService, getRelationship: resourceService, getRelationships: resourceService, update: resourceService)
        {
        }

        [HttpPatch("{id}")]
        public override Task<IActionResult> PatchAsync(int id, Subtask entity)
        {
            var errorActionResult = Error(new Error(400, "Updating the subtask is not allowed"));

            return Task.FromResult(errorActionResult);
        }

        // TODO: decide if restarting is needed (it probably is not, it should take care of itself)
        [HttpPost("{id}/restart")]
        public Task<IActionResult> RestartAsync(int id)
        {
            var restartedSubtask = new Subtask
            {
                Status = SubtaskStatus.WaitingForExecution,
                Result = null,
                Token = Guid.NewGuid()
            };

            return base.PatchAsync(id, restartedSubtask);
        }
    }
}
