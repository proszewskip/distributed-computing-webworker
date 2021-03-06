using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Services.Cleanup;

namespace Server.Services.Api
{
    /// <summary>
    /// Service used for marking subtasks as failed (finished with errors).
    /// </summary>
    public interface IComputationFailService
    {
        /// <summary>
        /// Marks a given SubtaskInProgress as failed, also marking the Subtask
        /// and DistributedTask as failed.
        /// </summary>
        /// <param name="subtaskInProgressId"></param>
        /// <param name="computationErrors"></param>
        /// <returns></returns>
        Task FailSubtaskInProgressAsync(int subtaskInProgressId, string[] computationErrors);
    }

    public class ComputationFailService : IComputationFailService
    {
        private static int MaxSubtaskRetries { get; } = 2;

        private readonly DistributedComputingDbContext _dbContext;
        private readonly ISubtasksInProgressCleanupService _subtasksInProgressCleanupService;

        public ComputationFailService(
            DistributedComputingDbContext dbContext,
            ISubtasksInProgressCleanupService subtasksInProgressCleanupService
        )
        {
            _dbContext = dbContext;
            _subtasksInProgressCleanupService = subtasksInProgressCleanupService;
        }

        public async Task FailSubtaskInProgressAsync(int subtaskInProgressId, string[] computationErrors)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                await InternalFailSubtaskInProgressAsync(subtaskInProgressId, computationErrors);

                transaction.Commit();
            }
        }

        private async Task InternalFailSubtaskInProgressAsync(int subtaskInProgressId, string[] computationErrors)
        {
            var failedSubtaskInProgress = await _dbContext.SubtasksInProgress.FindAsync(subtaskInProgressId);

            failedSubtaskInProgress.Status = SubtaskInProgressStatus.Error;
            failedSubtaskInProgress.Errors = computationErrors;

            await _dbContext.SaveChangesAsync();

            var failedSubtasksCount = await _dbContext.SubtasksInProgress
                .CountAsync(subtaskInProgress =>
                    subtaskInProgress.SubtaskId == failedSubtaskInProgress.SubtaskId &&
                    subtaskInProgress.Status == SubtaskInProgressStatus.Error
                );

            if (failedSubtasksCount >= MaxSubtaskRetries)
            {
                await FailSubtaskAsync(failedSubtaskInProgress);
                await _dbContext.SaveChangesAsync();
            }
        }

        private async Task FailSubtaskAsync(SubtaskInProgress failedSubtaskInProgress)
        {
            var failedSubtask = await _dbContext.Subtasks.FindAsync(failedSubtaskInProgress.SubtaskId);
            failedSubtask.Status = SubtaskStatus.Error;
            failedSubtask.Errors = failedSubtaskInProgress.Errors;

            _subtasksInProgressCleanupService.RemoveSubtasksInProgress(failedSubtask.Id);

            await FailDistributedTask(failedSubtask);
        }

        private async Task FailDistributedTask(Subtask failedSubtask)
        {
            var finishedDistributedTask = await _dbContext.DistributedTasks.FindAsync(failedSubtask.DistributedTaskId);

            finishedDistributedTask.Status = DistributedTaskStatus.Error;
            finishedDistributedTask.Errors = failedSubtask.Errors;
        }
    }
}
