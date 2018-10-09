using System;
using System.Linq;
using System.Threading.Tasks;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DTO;
using Server.Models;
using Server.Services.Api;
using Server.Services;
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
        private readonly IJsonApiResponseFactory _jsonApiResponseFactory;

        public SubtaskOperationsController(
            IResourceService<DistributedNode, Guid> distributedNodeResourceService,
            IResourceService<SubtaskInProgress> subtaskInProgressResourceService,
            IResourceService<Subtask> subtaskResourceService,
            DistributedComputingDbContext dbContext,
            IJsonApiResponseFactory jsonApiResponseFactory,
            IJsonApiContext jsonApiContext
        )
        {
            _distributedNodeResourceService = distributedNodeResourceService;
            _subtaskInProgressResourceService = subtaskInProgressResourceService;
            _subtaskResourceService = subtaskResourceService;
            _dbContext = dbContext;
            _jsonApiResponseFactory = jsonApiResponseFactory;
        }

        [HttpPost("assign-next")]
        [ValidateModel]
        public async Task<IActionResult> AssignNextAsync([FromBody] AssignNextSubtaskDTO body)
        {
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

            _jsonApiResponseFactory.ApplyFakeContext<SubtaskInProgress>(this);
            return await _jsonApiResponseFactory.CreateResponseAsync(HttpContext.Response, createdSubtaskInProgress);
        }

        private Task<Subtask> GetNextSubtaskAsync()
        {
            // TODO: add sorting by DistributedTask priority
            return _dbContext.Subtasks.Include(subtask => subtask.DistributedTask).FirstOrDefaultAsync(subtask =>
                   (subtask.Status == SubtaskStatus.WaitingForExecution || subtask.Status == SubtaskStatus.Executing) &&
                   subtask.DistributedTask.Status == DistributedTaskStatus.InProgress &&
                   (!subtask.SubtasksInProgress.Any() ||
                   subtask.SubtasksInProgress
                      .Where(subtaskInProgress => subtaskInProgress.Status != SubtaskStatus.Error)
                      .Sum(subtaskInProgress => subtaskInProgress.Node.TrustLevel)
                   < subtask.DistributedTask.TrustLevelToComplete)
            );
        }
    }
}
