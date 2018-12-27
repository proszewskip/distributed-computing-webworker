using System.Threading.Tasks;
using JsonApiDotNetCore.Services;
using Microsoft.EntityFrameworkCore;
using Server.Models;

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
        private readonly IResourceService<SubtaskInProgress> _subtaskInProgressResourceService;
        private readonly IResourceService<Subtask> _subtaskResourceService;

        public ComputationFailService(
            DistributedComputingDbContext dbContext,
            IResourceService<SubtaskInProgress> subtaskInProgressResourceService,
            IResourceService<Subtask> subtaskResourceService)
        {
            _dbContext = dbContext;
            _subtaskInProgressResourceService = subtaskInProgressResourceService;
            _subtaskResourceService = subtaskResourceService;
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
            var failedSubtaskInProgress = await _subtaskInProgressResourceService.GetAsync(subtaskInProgressId);

            failedSubtaskInProgress.Status = SubtaskStatus.Error;
            failedSubtaskInProgress.Errors = computationErrors;

            await _subtaskInProgressResourceService.UpdateAsync(subtaskInProgressId, failedSubtaskInProgress);

            var failedSubtasksCount = await _dbContext.SubtasksInProgress
                .CountAsync(subtaskInProgress =>
                    subtaskInProgress.SubtaskId == failedSubtaskInProgress.SubtaskId &&
                    subtaskInProgress.Status == SubtaskStatus.Error
                );

            if (failedSubtasksCount >= MaxSubtaskRetries)
            {
                await FailSubtaskAsync(failedSubtaskInProgress);
            }

            await _dbContext.SaveChangesAsync();
        }

        private async Task FailSubtaskAsync(SubtaskInProgress failedSubtaskInProgress)
        {
            var subtask = await _subtaskResourceService.GetAsync(failedSubtaskInProgress.SubtaskId);
            subtask.Status = SubtaskStatus.Error;

            await _subtaskResourceService.UpdateAsync(failedSubtaskInProgress.SubtaskId, subtask);

            await FailDistributedTask(subtask);
        }

        private async Task FailDistributedTask(Subtask subtask)
        {
            //TODO: Use IResourceService for updating DistributedTasks.
            var finishedDistributedTask = await _dbContext.DistributedTasks.FirstAsync(distributedTask =>
                distributedTask.Id == subtask.DistributedTaskId);

            finishedDistributedTask.Status = DistributedTaskStatus.Error;
        }
    }
}
