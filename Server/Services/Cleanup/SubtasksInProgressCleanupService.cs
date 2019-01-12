using System.Linq;
using Server.Models;

namespace Server.Services.Cleanup
{
    /// <summary>
    /// Service used for removing subtask's SubtasksInProgress.
    ///
    /// Such a cleanup should be used after the subtask is marked as completed,
    /// regardless of whether due to an error or a successful completion.
    /// </summary>
    public interface ISubtasksInProgressCleanupService
    {
        /// <summary>
        /// Removes subtask's SubtasksInProgress.
        /// </summary>
        /// <param name="subtaskId"></param>
        void RemoveSubtasksInProgress(int subtaskId);
    }

    public class SubtasksInProgressCleanupService : ISubtasksInProgressCleanupService
    {
        private readonly DistributedComputingDbContext _dbContext;

        public SubtasksInProgressCleanupService(DistributedComputingDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void RemoveSubtasksInProgress(int subtaskId)
        {
            var subtasksInProgressToRemove =
                _dbContext.SubtasksInProgress.Where(subtaskInProgress => subtaskInProgress.SubtaskId == subtaskId);

            _dbContext.SubtasksInProgress.RemoveRange(subtasksInProgressToRemove);
        }
    }
}
