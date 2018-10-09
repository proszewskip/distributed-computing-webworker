using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Microsoft.EntityFrameworkCore;
using Server.DTO;
using Server.Models;
using Server.Services;
using Server.Services.Api;
using Server.Validation;

namespace Server.Controllers
{
    [Route("subtasks")]
    public class SubtaskOperationsController : Controller
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IResourceService<DistributedNode, Guid> _distributedNodeResourceService;
        private readonly IResourceService<SubtaskInProgress> _subtaskInProgressResourceService;
        private readonly IResourceService<Subtask> _subtaskResourceService;
        private readonly IComputationFinishService _computationFinishService;

        public SubtaskOperationsController(
            IResourceService<DistributedNode, Guid> distributedNodeResourceService,
            IResourceService<SubtaskInProgress> subtaskInProgressResourceService,
            IResourceService<Subtask> subtaskResourceService,
            IComputationFinishService computationFinishService,
            DistributedComputingDbContext dbContext
        )
        {
            _distributedNodeResourceService = distributedNodeResourceService;
            _subtaskInProgressResourceService = subtaskInProgressResourceService;
            _subtaskResourceService = subtaskResourceService;
            _computationFinishService = computationFinishService;
            _dbContext = dbContext;
        }

        [HttpPost("assign-next")]
        [ValidateModel]
        public async Task<IActionResult> AssignNextAsync([FromBody] AssignNextSubtaskDTO body)
        {
            // TODO: use JSON API response format instead of a regular NotFound
            if (!Guid.TryParse(body.DistributedNodeId, out var distributedNodeId))
                return BadRequest(); // TODO: specify the reason

            var distributedNode = await _distributedNodeResourceService.GetAsync(distributedNodeId);

            if (distributedNode == null)
                return NotFound(); // TODO: specify the reason

            var nextSubtask = await GetNextSubtaskAsync();

            if (nextSubtask == null)
                return NotFound(); // TODO: specify the reason

            var subtaskInProgress = new SubtaskInProgress
            {
                Node = distributedNode,
                Status = SubtaskStatus.Executing,
                Subtask = nextSubtask
            };

            var createdSubtaskInProgress = await _subtaskInProgressResourceService.CreateAsync(subtaskInProgress);

            await _subtaskResourceService.UpdateAsync(subtaskInProgress.SubtaskId,
                new Subtask { Status = SubtaskStatus.Executing });

            return Ok(createdSubtaskInProgress);
        }


        [HttpPost("{id}/finish-computation")]
        [ValidateModel]
        public async Task<IActionResult> FinishComputationAsync(int id, [FromForm] SuccesfulSubtaskDTO form)
        {
            if (!Guid.TryParse(form.DistributedNodeId, out var distributedNodeId))
                return BadRequest(); // TODO: specify the reason

            var finishedSubtaskInProgress = await _dbContext.SubtasksInProgress
                .Include(subtaskInProgress => subtaskInProgress.Node)
                .Include(subtaskInProgress => subtaskInProgress.Subtask)
                .FirstOrDefaultAsync(subtaskInProgress =>
                    subtaskInProgress.Id == id && subtaskInProgress.Status == SubtaskStatus.Executing &&
                    subtaskInProgress.NodeId == distributedNodeId);

            if (finishedSubtaskInProgress == null)
                return NotFound();

            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                await _computationFinishService.FinishSubtaskInProgressAsync(id, form);

                var isSubtaskFinished = await _computationFinishService.FinishSubtaskAsync(finishedSubtaskInProgress.SubtaskId);

                if (isSubtaskFinished)
                    await _computationFinishService.FinishTaskAsync(finishedSubtaskInProgress.Subtask.DistributedTaskId);

                transaction.Commit();
            }

            return Ok();
        }

        [HttpPost("{id}/computation-error")]
        [ValidateModel]
        public async Task<IActionResult> ReportComputationErrorAsync(int id, [FromForm] FailedSubtaskDTO form)
        {
            if (!Guid.TryParse(form.DistributedNodeId, out var distributedNodeId))
                return BadRequest(); // TODO: specify the reason

            var faultySubtaskInProgress = await _dbContext.SubtasksInProgress
                .Include(subtaskInProgress => subtaskInProgress.Node)
                .FirstOrDefaultAsync(subtaskInProgress =>
                    subtaskInProgress.Id == id && subtaskInProgress.Status == SubtaskStatus.Executing &&
                    subtaskInProgress.NodeId == distributedNodeId);

            if (faultySubtaskInProgress == null)
                return NotFound();

            await _computationFinishService.FinishFailedSubtaskAsync(id, form);

            return Ok();
        }

        private Task<Subtask> GetNextSubtaskAsync()
        {
            // TODO: add sorting by DistributedTask priority
            return _dbContext.Subtasks.FirstOrDefaultAsync(subtask =>
                (subtask.Status == SubtaskStatus.WaitingForExecution || subtask.Status == SubtaskStatus.Executing) &&
                !subtask.SubtasksInProgress.Any() ||
                subtask.SubtasksInProgress.Where(subtaskInProgress => subtaskInProgress.Status != SubtaskStatus.Error)
                    .Sum(subtaskInProgress => subtaskInProgress.Node.TrustLevel) <
                subtask.DistributedTask.TrustLevelToComplete);
        }
    }
}
