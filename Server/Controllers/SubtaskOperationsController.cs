using System;
using System.Linq;
using System.Threading.Tasks;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DTO;
using Server.Models;
using Server.Services;
using Server.Validation;

namespace Server.Controllers
{
    [Route("subtasks")]
    public class SubtaskOperationsController : Controller
    {
        private readonly IAssemblyLoader _assemblyLoader;
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IResourceService<DistributedNode, Guid> _distributedNodeResourceService;
        private readonly IPathsProvider _pathsProvider;
        private readonly IProblemPluginFacadeFactory _problemPluginFacadeFactory;
        private readonly IResourceService<SubtaskInProgress> _subtaskInProgressResourceService;
        private readonly IResourceService<Subtask> _subtaskResourceService;

        public SubtaskOperationsController(
            IResourceService<DistributedNode, Guid> distributedNodeResourceService,
            IResourceService<SubtaskInProgress> subtaskInProgressResourceService,
            IResourceService<Subtask> subtaskResourceService,
            IProblemPluginFacadeFactory problemPluginFacadeFactory,
            IAssemblyLoader assemblyLoader,
            IPathsProvider pathsProvider,
            DistributedComputingDbContext dbContext
        )
        {
            _distributedNodeResourceService = distributedNodeResourceService;
            _subtaskInProgressResourceService = subtaskInProgressResourceService;
            _subtaskResourceService = subtaskResourceService;
            _problemPluginFacadeFactory = problemPluginFacadeFactory;
            _assemblyLoader = assemblyLoader;
            _pathsProvider = pathsProvider;
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
                new Subtask {Status = SubtaskStatus.Executing});

            return Ok(createdSubtaskInProgress);
        }


        [HttpPost("{id}/finish-computation")]
        [ValidateModel]
        public async Task<IActionResult> FinishComputationAsync(int id, [FromBody] FinishSubtaskDTO body)
        {
            if (!Guid.TryParse(body.DistributedNodeId, out var distributedNodeId))
                return BadRequest(); // TODO: specify the reason

            var finishedSubtaskInProgress = await _dbContext.SubtasksInProgress
                .Include(subtaskInProgress => subtaskInProgress.Node)
                .Include(subtaskInProgress => subtaskInProgress.Subtask)
                .ThenInclude(subtask => subtask.DistributedTask)
                .ThenInclude(distributedTask => distributedTask.DistributedTaskDefinition)
                .FirstOrDefaultAsync(subtaskInProgress => subtaskInProgress.Id == id);

            if (finishedSubtaskInProgress == null)
                return NotFound();

            if (finishedSubtaskInProgress.Status != SubtaskStatus.Executing)
                return BadRequest(); // TODO: specify the reason

            if (finishedSubtaskInProgress.NodeId != distributedNodeId)
                return BadRequest(); // TODO: specify the reason

            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                await UpdateSubtaskInProgressAsync(body, finishedSubtaskInProgress);

                if (IsSubtaskFullyComputed(finishedSubtaskInProgress.SubtaskId))
                {
                    await FinishSubtaskAsync(finishedSubtaskInProgress);

                    if (IsTaskFullyComputed(finishedSubtaskInProgress.Subtask.DistributedTaskId))
                        await FinishTaskAsync(finishedSubtaskInProgress);
                }

                transaction.Commit();
            }

            return Ok();
        }

        private Task<Subtask> GetNextSubtaskAsync()
        {
            // TODO: add sorting by DistributedTask priority
            return _dbContext.Subtasks.FirstOrDefaultAsync(subtask =>
                (subtask.Status == SubtaskStatus.WaitingForExecution || subtask.Status == SubtaskStatus.Executing) &&
                !subtask.SubtasksInProgress.Any() || subtask.SubtasksInProgress
                    .Where(subtaskInProgress => subtaskInProgress.Status != SubtaskStatus.Error)
                    .Sum(subtaskInProgress => subtaskInProgress.Node.TrustLevel) <
                subtask.DistributedTask.TrustLevelToComplete);
        }

        private async Task UpdateSubtaskInProgressAsync(FinishSubtaskDTO body, SubtaskInProgress subtaskInProgress)
        {
            if (subtaskInProgress.Errors != null)
            {
                subtaskInProgress.Errors = body.Errors;

                subtaskInProgress.Subtask.Status = SubtaskStatus.Error;
                subtaskInProgress.Subtask.DistributedTask.Status = DistributedTaskStatus.Error;
            }
            else
            {
                subtaskInProgress.Status = SubtaskStatus.Done;
                subtaskInProgress.Result = body.SubtaskResult;
            }

            await _dbContext.SaveChangesAsync();
        }

        private async Task FinishTaskAsync(SubtaskInProgress finishedSubtaskInProgress)
        {
            var problemPluginFacade =
                GetProblemPluginFacade(finishedSubtaskInProgress.Subtask.DistributedTask.DistributedTaskDefinition);

            var subtaskResults = _dbContext.Subtasks
                .Where(subtask => subtask.DistributedTaskId == finishedSubtaskInProgress.Subtask.DistributedTaskId)
                .Select(subtask => subtask.Result);

            try
            {
                finishedSubtaskInProgress.Subtask.DistributedTask.Result =
                    problemPluginFacade.JoinSubtaskResults(subtaskResults);
            }
            catch (Exception exception)
            {
                finishedSubtaskInProgress.Subtask.DistributedTask.Status = DistributedTaskStatus.Error;
                finishedSubtaskInProgress.Subtask.DistributedTask.Errors = finishedSubtaskInProgress.Subtask
                    .DistributedTask.Errors.Append(exception.InnerException.ToString()).ToArray();
            }

            await _dbContext.SaveChangesAsync();
        }

        private async Task FinishSubtaskAsync(SubtaskInProgress finishedSubtaskInProgress)
        {
            var subtasksInProgress = _dbContext.SubtasksInProgress.Where(subtaskInProgress =>
                subtaskInProgress.SubtaskId == finishedSubtaskInProgress.SubtaskId);
            if (subtasksInProgress.Any(
                subtaskInProgress => subtaskInProgress.Result != finishedSubtaskInProgress.Result))
            {
                await subtasksInProgress.ForEachAsync(subtaskInProgress =>
                {
                    subtaskInProgress.Errors.Append(
                        "Divergent results detected. Subtask must be computed again.");
                    subtaskInProgress.Status = SubtaskStatus.Error;
                });
            }
            else
            {
                finishedSubtaskInProgress.Subtask.Result = finishedSubtaskInProgress.Result;
                finishedSubtaskInProgress.Subtask.Status = SubtaskStatus.Done;
            }

            await _dbContext.SaveChangesAsync();
        }

        private bool IsSubtaskFullyComputed(int subtaskId)
        {
            var currentTrustLevel = _dbContext.SubtasksInProgress.Where(subtaskInProgress =>
                    subtaskInProgress.SubtaskId == subtaskId
                    && subtaskInProgress.Status == SubtaskStatus.Done)
                .Sum(subtaskinProgress => subtaskinProgress.Node.TrustLevel);

            return currentTrustLevel >= _dbContext.Subtasks.Include(subtask => subtask.DistributedTask)
                       .First(subtask => subtask.Id == subtaskId).DistributedTask.TrustLevelToComplete;
        }

        private bool IsTaskFullyComputed(int distributedTaskId)
        {
            return _dbContext.Subtasks.Where(subtask => subtask.DistributedTaskId == distributedTaskId)
                .All(subtask => subtask.Status == SubtaskStatus.Done);
        }

        private IProblemPluginFacade GetProblemPluginFacade(DistributedTaskDefinition distributedTaskDefinition)
        {
            var assemblyPath =
                _pathsProvider.GetCompiledTaskDefinitionMainAssemblyPath(distributedTaskDefinition.DefinitionGuid,
                    distributedTaskDefinition.MainDllName);
            var taskAssembly = _assemblyLoader.LoadAssembly(assemblyPath);

            return _problemPluginFacadeFactory.Create(taskAssembly);
        }
    }
}
