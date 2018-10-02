using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DTO;
using Server.Models;
using Server.Validation;

namespace Server.Controllers
{
    [Route("subtasks")]
    public class SubtaskOperationsController : Controller
    {
        private readonly IResourceService<DistributedNode, Guid> _distributedNodeResourceService;
        private readonly IResourceService<SubtaskInProgress> _subtaskInProgressResourceService;
        private readonly IResourceService<Subtask> _subtaskResourceService;
        private readonly DistributedComputingDbContext _dbContext;

        public SubtaskOperationsController(
            IResourceService<DistributedNode, Guid> distributedNodeResourceService,
            IResourceService<SubtaskInProgress> subtaskInProgressResourceService,
            IResourceService<Subtask> subtaskResourceService,
            DistributedComputingDbContext dbContext
        )
        {
            _distributedNodeResourceService = distributedNodeResourceService;
            _subtaskInProgressResourceService = subtaskInProgressResourceService;
            _subtaskResourceService = subtaskResourceService;
            _dbContext = dbContext;
        }

        [HttpPost("assign-next")]
        [ValidateModel]
        public async Task<IActionResult> AssignNextAsync([FromBody] AssignNextSubtaskDTO body)
        {
            // TODO: fix parsing the GUID
            var distributedNode = await _distributedNodeResourceService.GetAsync(body.DistributedNodeId);

            // TODO: use JSON API response format instead of a regular NotFound
            if (distributedNode == null)
                return NotFound(); // TODO: specify the reason

            var nextSubtask = await GetNextSubtaskAsync();

            if (nextSubtask == null)
                return NotFound(); // TODO: specify the reason

            var subtaskInProgress = new SubtaskInProgress
            {
                Node = distributedNode,
                Status = SubtaskStatus.Executing,
                Subtask = nextSubtask,
            };

            var createdSubtaskInProgress = await _subtaskInProgressResourceService.CreateAsync(subtaskInProgress);

            await _subtaskResourceService.UpdateAsync(subtaskInProgress.SubtaskId,
                new Subtask { Status = SubtaskStatus.Executing });

            return Ok(createdSubtaskInProgress);
        }

        private Task<Subtask> GetNextSubtaskAsync()
        {
            // TODO: add sorting by DistributedTask priority
            return _dbContext.Subtasks.FirstOrDefaultAsync(subtask =>
                (subtask.Status == SubtaskStatus.WaitingForExecution || subtask.Status == SubtaskStatus.Executing) &&
                subtask.SubtasksInProgress.Sum(subtaskInProgress => subtaskInProgress.Node.TrustLevel) < subtask.DistributedTask.TrustLevelToComplete);
        }
    }
}
