using System;
using System.Linq;
using System.Threading.Tasks;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DTO;
using Server.Filters;
using Server.Models;
using Server.Services;
using Server.Services.Api;
using Server.Validation;

namespace Server.Controllers
{
    /// <summary>
    /// Controller responsible for assigning subtasks to distributed nodes.
    /// </summary>
    [Route("subtasks")]
    [ServiceFilter(typeof(FormatErrorActionFilter))]
    public class SubtaskOperationsController : Controller
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IGetNextSubtaskToComputeService _getNextSubtaskToComputeService;
        private readonly IResourceService<DistributedNode, Guid> _distributedNodeResourceService;
        private readonly IResourceService<SubtaskInProgress> _subtaskInProgressResourceService;
        private readonly IPathsProvider _pathsProvider;

        public SubtaskOperationsController(
            IResourceService<DistributedNode, Guid> distributedNodeResourceService,
            IResourceService<SubtaskInProgress> subtaskInProgressResourceService,
            DistributedComputingDbContext dbContext,
            IGetNextSubtaskToComputeService getNextSubtaskToComputeService,
            IPathsProvider pathsProvider
        )
        {
            _distributedNodeResourceService = distributedNodeResourceService;
            _subtaskInProgressResourceService = subtaskInProgressResourceService;
            _dbContext = dbContext;
            _getNextSubtaskToComputeService = getNextSubtaskToComputeService;
            _pathsProvider = pathsProvider;
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

            var nextSubtask = await _getNextSubtaskToComputeService.GetNextSubtaskAsync();

            if (nextSubtask == null)
                return NotFound(); // TODO: specify the reason

            var subtaskInProgress = new SubtaskInProgress
            {
                Node = distributedNode,
                Status = SubtaskInProgressStatus.Executing,
                Subtask = nextSubtask
            };

            var createdSubtaskInProgress = await _subtaskInProgressResourceService.CreateAsync(subtaskInProgress);

            nextSubtask.Status = SubtaskStatus.Executing;
            _dbContext.Subtasks.Update(nextSubtask);
            await _dbContext.SaveChangesAsync();

            var distributedTaskDefinition = await GetSubtasksDistributedTaskDefinition(nextSubtask);

            var response = new AssignNextSubtaskResultDTO()
            {
                CompiledTaskDefinitionURL =
                    _pathsProvider.GetCompiledTaskDefinitionWebPath(distributedTaskDefinition.DefinitionGuid),
                SubtaskId = nextSubtask.StringId,
                ProblemPluginInfo = distributedTaskDefinition.ProblemPluginInfo,
                SubtaskInProgressId = createdSubtaskInProgress.StringId
            };

            return Created($"/subtasks-in-progress/{createdSubtaskInProgress.Id}", response);
        }

        private Task<DistributedTaskDefinition> GetSubtasksDistributedTaskDefinition(Subtask subtask)
        {
            return _dbContext.Subtasks.Where(otherSubtask => otherSubtask.Id == subtask.Id)
                .Select(otherSubtask => otherSubtask.DistributedTask.DistributedTaskDefinition)
                .Include(definition => definition.ProblemPluginInfo)
                .SingleAsync();
        }
    }
}
