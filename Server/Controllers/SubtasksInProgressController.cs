using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DTO;
using Server.Models;
using Server.Services.Api;
using Server.Validation;

namespace Server.Controllers
{
    [Route("subtasks-in-progress")]
    public class SubtaskInProgressController : Controller
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IFinishComputationService _finishComputationService;

        public SubtaskInProgressController(
            IFinishComputationService finishComputationService,
            DistributedComputingDbContext dbContext
        )
        {
            _finishComputationService = finishComputationService;
            _dbContext = dbContext;
        }

        [HttpPost("finish-computation")]
        [ValidateModel]
        public async Task<IActionResult> FinishComputationAsync([FromForm] ComputationSuccessDTO computationSuccessDto)
        {
            if (!Guid.TryParse(computationSuccessDto.DistributedNodeId, out var distributedNodeId))
                return BadRequest(); // TODO: specify the reason

            var finishedSubtaskInProgress = await _dbContext.SubtasksInProgress
                .Include(subtaskInProgress => subtaskInProgress.Subtask)
                .FirstOrDefaultAsync(subtaskInProgress =>
                    subtaskInProgress.Id == computationSuccessDto.SubtaskInProgressId &&
                    subtaskInProgress.Status == SubtaskStatus.Executing &&
                    subtaskInProgress.NodeId == distributedNodeId);

            if (finishedSubtaskInProgress == null)
                return NotFound();

            await _finishComputationService.CompleteSubtaskInProgressAsync(computationSuccessDto.SubtaskInProgressId,
                computationSuccessDto.SubtaskResult);

            return Ok();
        }

        [HttpPost("computation-error")]
        [ValidateModel]
        public async Task<IActionResult> ReportComputationErrorAsync([FromForm] ComputationErrorDTO computationErrorDto)
        {
            if (!Guid.TryParse(computationErrorDto.DistributedNodeId, out var distributedNodeId))
                return BadRequest(); // TODO: specify the reason

            var faultySubtaskInProgress = await _dbContext.SubtasksInProgress
                .FirstOrDefaultAsync(subtaskInProgress =>
                    subtaskInProgress.Id == computationErrorDto.SubtaskInProgressId &&
                    subtaskInProgress.Status == SubtaskStatus.Executing &&
                    subtaskInProgress.NodeId == distributedNodeId);

            if (faultySubtaskInProgress == null)
                return NotFound();

            await _finishComputationService.FailSubtaskInProgressAsync(computationErrorDto.SubtaskInProgressId,
                computationErrorDto.Errors);

            return Ok();
        }
    }
}
