using System;
using System.Threading.Tasks;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Server.DTO;
using Server.Models;
using Server.Services.Api;
using Server.Validation;

namespace Server.Controllers
{
    [Route("subtasks-in-progress")]
    public class SubtaskInProgressOperationsController : Controller
    {
        private readonly IFinishComputationService _finishComputationService;
        private readonly IResourceService<SubtaskInProgress> _subtaskInProgressResourceService;

        public SubtaskInProgressOperationsController(
            IFinishComputationService finishComputationService,
            IResourceService<SubtaskInProgress> subtaskInProgressResourceService
        )
        {
            _finishComputationService = finishComputationService;
            _subtaskInProgressResourceService = subtaskInProgressResourceService;
        }

        [HttpPost("computation-success")]
        [ValidateModel]
        public async Task<IActionResult> FinishComputationAsync([FromForm] ComputationSuccessDTO computationSuccessDto)
        {
            if (!Guid.TryParse(computationSuccessDto.DistributedNodeId, out var distributedNodeId))
                return BadRequest(); // TODO: specify the reason

            var finishedSubtaskInProgress =
                await _subtaskInProgressResourceService.GetAsync(computationSuccessDto.SubtaskInProgressId);

            if (finishedSubtaskInProgress == null || finishedSubtaskInProgress.Status != SubtaskStatus.Executing ||
                finishedSubtaskInProgress.NodeId != distributedNodeId)
                return NotFound();

            using (var subtaskInProgressResultStream = computationSuccessDto.SubtaskResult.OpenReadStream())
            {
                await _finishComputationService.CompleteSubtaskInProgressAsync(
                    computationSuccessDto.SubtaskInProgressId, subtaskInProgressResultStream);
            }

            return Ok();
        }

        [HttpPost("computation-error")]
        [ValidateModel]
        public async Task<IActionResult> ReportComputationErrorAsync([FromForm] ComputationErrorDTO computationErrorDto)
        {
            if (!Guid.TryParse(computationErrorDto.DistributedNodeId, out var distributedNodeId))
                return BadRequest(); // TODO: specify the reason

            var faultySubtaskInProgress =
                await _subtaskInProgressResourceService.GetAsync(computationErrorDto.SubtaskInProgressId);

            if (faultySubtaskInProgress == null || faultySubtaskInProgress.Status != SubtaskStatus.Executing ||
                faultySubtaskInProgress.NodeId != distributedNodeId)
                return NotFound();

            await _finishComputationService.FailSubtaskInProgressAsync(computationErrorDto.SubtaskInProgressId,
                computationErrorDto.Errors);

            return Ok();
        }
    }
}
