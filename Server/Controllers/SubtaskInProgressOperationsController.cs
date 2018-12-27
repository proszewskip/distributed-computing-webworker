using System;
using System.Threading.Tasks;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Server.DTO;
using Server.Filters;
using Server.Models;
using Server.Services.Api;
using Server.Validation;

namespace Server.Controllers
{
    /// <summary>
    /// Controller responsible for managing subtasks in progress
    /// </summary>
    [Route("subtasks-in-progress")]
    [ServiceFilter(typeof(FormatErrorActionFilter))]
    public class SubtaskInProgressOperationsController : Controller
    {
        private readonly IComputationFailService _computationFailService;
        private readonly IComputationCompleteService _computationCompleteService;
        private readonly IResourceService<SubtaskInProgress> _subtaskInProgressResourceService;

        public SubtaskInProgressOperationsController(
            IComputationFailService computationFailService,
            IComputationCompleteService computationCompleteService,
            IResourceService<SubtaskInProgress> subtaskInProgressResourceService
        )
        {
            _computationFailService = computationFailService;
            _computationCompleteService = computationCompleteService;
            _subtaskInProgressResourceService = subtaskInProgressResourceService;
        }

        [HttpPost("computation-success")]
        [ValidateModel]
        public async Task<IActionResult> ReportComputationSuccessAsync([FromForm] ComputationSuccessDTO computationSuccessDto)
        {
            if (!Guid.TryParse(computationSuccessDto.DistributedNodeId, out var distributedNodeId))
                return BadRequest(); // TODO: specify the reason

            var finishedSubtaskInProgress =
                await _subtaskInProgressResourceService.GetAsync(computationSuccessDto.SubtaskInProgressId);

            if (finishedSubtaskInProgress == null || finishedSubtaskInProgress.Status != SubtaskInProgressStatus.Executing ||
                finishedSubtaskInProgress.NodeId != distributedNodeId)
                return NotFound();

            using (var subtaskInProgressResultStream = computationSuccessDto.SubtaskResult.OpenReadStream())
            {
                await _computationCompleteService.CompleteSubtaskInProgressAsync(
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

            if (faultySubtaskInProgress == null || faultySubtaskInProgress.Status != SubtaskInProgressStatus.Executing ||
                faultySubtaskInProgress.NodeId != distributedNodeId)
                return NotFound();

            await _computationFailService.FailSubtaskInProgressAsync(computationErrorDto.SubtaskInProgressId,
                computationErrorDto.Errors);

            return Ok();
        }
    }
}
