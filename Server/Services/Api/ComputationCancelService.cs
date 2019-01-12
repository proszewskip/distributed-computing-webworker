using System.Threading.Tasks;
using Server.Models;

namespace Server.Services.Api
{
    /// <summary>
    /// A service for cancelling SubtasksInProgress.
    /// </summary>
    public interface IComputationCancelService
    {
        Task CancelSubtaskInProgressAsync(int subtaskInProgressId);

        Task CancelSubtaskInProgressWithoutSavingAsync(int subtaskInProgressId);
    }

    public class ComputationCancelService : IComputationCancelService
    {
        private readonly DistributedComputingDbContext _dbContext;

        public ComputationCancelService(DistributedComputingDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CancelSubtaskInProgressAsync(int subtaskInProgressId)
        {
            await CancelSubtaskInProgressWithoutSavingAsync(subtaskInProgressId);
            await _dbContext.SaveChangesAsync();
        }

        public async Task CancelSubtaskInProgressWithoutSavingAsync(int subtaskInProgressId)
        {
            var subtaskInProgress = await _dbContext.SubtasksInProgress.FindAsync(subtaskInProgressId);

            subtaskInProgress.Status = SubtaskInProgressStatus.Cancelled;
        }
    }
}
