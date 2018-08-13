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
        private readonly IResourceService<SubtaskInProgress> _subtaskInProgResourceService;
        private readonly DistributedComputingDbContext _dbContext;

        public SubtaskOperationsController(
            IResourceService<DistributedNode, Guid> distributedNodeResourceService,
            IResourceService<SubtaskInProgress> subtaskInProgResourceService,
            DistributedComputingDbContext dbContext
        )
        {
            _distributedNodeResourceService = distributedNodeResourceService;
            _subtaskInProgResourceService = subtaskInProgResourceService;
            _dbContext = dbContext;
        }

        [HttpPost("assign-next")]
        [ValidateModel]
        public async Task<IActionResult> AssignNextAsync([FromBody] AssignNextSubtaskDTO body)
        {
            var distributedNode = await _distributedNodeResourceService.GetAsync(body.DistributedNodeId);

            if (distributedNode == null)
                return NotFound();

            var nextSubtask = await GetNextSubtaskAsync();

            if (nextSubtask == null)
                return NotFound(); // TODO: provide information about no subtasks

            var subtaskInProgress = new SubtaskInProgress
            {
                Node = distributedNode,
                Status = SubtaskStatus.Executing,
                Subtask = nextSubtask,
            };

            return Ok(await _subtaskInProgResourceService.CreateAsync(subtaskInProgress));
        }

        private Task<Subtask> GetNextSubtaskAsync()
        {
            return _dbContext.Subtasks.FirstOrDefaultAsync(subtask =>
                subtask.SubtasksInProgress.Sum(subtaskInProgress => subtaskInProgress.Node.TrustLevel) <
                subtask.DistributedTask.TrustLevelToComplete);
        }
    }
}
