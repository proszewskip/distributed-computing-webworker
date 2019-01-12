using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Exceptions;
using Server.Models;
using Server.Services.Cleanup;

namespace Server.Services.Api
{
    /// <summary>
    /// Service used for synchronizing completing the computation of subtasks.
    /// </summary>
    public interface IComputationCompleteService
    {
        /// <summary>
        /// Marks a given SubtaskInProgress as complete, possibly also marking
        /// the Subtask as complete and DistributedTask as complete.
        ///
        /// Hierarchical marking as complete is done when all the siblings
        /// are also completed.
        /// </summary>
        /// <param name="subtaskInProgressId"></param>
        /// <param name="subtaskInProgressResult"></param>
        /// <returns></returns>
        Task CompleteSubtaskInProgressAsync(int subtaskInProgressId, Stream subtaskInProgressResult);
    }

    public class ComputationCompleteService : IComputationCompleteService
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IProblemPluginFacadeProvider _problemPluginFacadeProvider;
        private readonly ISubtasksInProgressCleanupService _subtasksInProgressCleanupService;

        public ComputationCompleteService(
            DistributedComputingDbContext dbContext,
            IProblemPluginFacadeProvider problemPluginFacadeProvider,
            ISubtasksInProgressCleanupService subtasksInProgressCleanupService
        )
        {
            _dbContext = dbContext;
            _problemPluginFacadeProvider = problemPluginFacadeProvider;
            _subtasksInProgressCleanupService = subtasksInProgressCleanupService;
        }

        public async Task CompleteSubtaskInProgressAsync(int subtaskInProgressId, Stream subtaskInProgressResult)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                await InternalCompleteSubtaskInProgressAsync(subtaskInProgressId, subtaskInProgressResult);

                transaction.Commit();
            }
        }

        private async Task InternalCompleteSubtaskInProgressAsync(int subtaskInProgressId,
            Stream subtaskInProgressResultStream)
        {
            var subtaskInProgressResult = new byte[subtaskInProgressResultStream.Length];

            using (var memoryStream = new MemoryStream(subtaskInProgressResult))
            {
                await subtaskInProgressResultStream.CopyToAsync(memoryStream);
            }

            var finishedSubtaskInProgress = await _dbContext.SubtasksInProgress.FindAsync(subtaskInProgressId);
            finishedSubtaskInProgress.Status = SubtaskInProgressStatus.Done;
            finishedSubtaskInProgress.Result = subtaskInProgressResult;

            await _dbContext.SaveChangesAsync();

            var isSubtaskFullyComputed = IsSubtaskFullyComputed(finishedSubtaskInProgress.SubtaskId);

            if (isSubtaskFullyComputed)
                await FinishSubtaskAsync(finishedSubtaskInProgress.SubtaskId);
        }

        private async Task FinishSubtaskAsync(int subtaskId)
        {
            var finishedSubtasksInProgress = _dbContext.SubtasksInProgress.Where(subtaskInProgress =>
                subtaskInProgress.SubtaskId == subtaskId && subtaskInProgress.Status == SubtaskInProgressStatus.Done);
            var subtaskResult = await GetMostTrustedSubtaskResultAsync(finishedSubtasksInProgress);

            var finishedSubtask = await _dbContext.Subtasks.FindAsync(subtaskId);

            finishedSubtask.Result = subtaskResult;
            finishedSubtask.Status = SubtaskStatus.Done;

            _subtasksInProgressCleanupService.RemoveSubtasksInProgress(subtaskId);

            await _dbContext.SaveChangesAsync();

            if (IsDistributedTaskFullyComputed(finishedSubtask.DistributedTaskId))
                await FinishDistributedTaskAsync(finishedSubtask.DistributedTaskId);
        }

        private Task<byte[]> GetMostTrustedSubtaskResultAsync(IQueryable<SubtaskInProgress> subtasksInProgress)
        {
            return subtasksInProgress.GroupBy(subtaskInProgress => subtaskInProgress.Result)
                .OrderByDescending(group => group.Sum(subtaskInProgress => subtaskInProgress.Node.TrustLevel))
                .Select(group => group.Key)
                .FirstAsync();
        }

        private bool IsSubtaskFullyComputed(int subtaskId)
        {
            var currentTrustLevel = _dbContext.SubtasksInProgress.Where(subtaskInProgress =>
                    subtaskInProgress.SubtaskId == subtaskId
                    && subtaskInProgress.Status == SubtaskInProgressStatus.Done)
                .Sum(subtaskInProgress => subtaskInProgress.Node.TrustLevel);

            var trustLevelToComplete = _dbContext.Subtasks.Where(subtask => subtask.Id == subtaskId)
                .Select(subtask => subtask.DistributedTask.TrustLevelToComplete).First();

            return currentTrustLevel >= trustLevelToComplete;
        }

        private async Task FinishDistributedTaskAsync(int distributedTaskId)
        {
            var finishedDistributedTask =
                await _dbContext.DistributedTasks.Include(distributedTask => distributedTask.DistributedTaskDefinition)
                    .FirstAsync(distributedTask =>
                        distributedTask.Id == distributedTaskId);

            var problemPluginFacade =
                _problemPluginFacadeProvider.Provide(finishedDistributedTask.DistributedTaskDefinition);

            var subtaskResults = _dbContext.Subtasks
                .Where(subtask => subtask.DistributedTaskId == distributedTaskId)
                .OrderBy(subtask => subtask.SequenceNumber)
                .Select(subtask => subtask.Result);

            try
            {
                finishedDistributedTask.Result =
                    problemPluginFacade.JoinSubtaskResults(subtaskResults);
                finishedDistributedTask.Status = DistributedTaskStatus.Done;
            }
            catch (SubtaskResultsJoiningException exception)
            {
                finishedDistributedTask.Status = DistributedTaskStatus.Error;
                finishedDistributedTask.Errors = finishedDistributedTask.Errors.Append(exception.ToString()).ToArray();
            }

            await _dbContext.SaveChangesAsync();
        }

        private bool IsDistributedTaskFullyComputed(int distributedTaskId)
        {
            return _dbContext.Subtasks.Where(subtask => subtask.DistributedTaskId == distributedTaskId)
                .All(subtask => subtask.Status == SubtaskStatus.Done);
        }
    }
}
