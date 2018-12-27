using System.Threading.Tasks;
using Server.Models;

namespace Server.Services.Api
{
    public interface IComputationCancelService
    {
        Task CancelSubtaskInProgressAsync(int subtaskInProgressId);
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
            var subtaskInProgress = await _dbContext.SubtasksInProgress.FindAsync(subtaskInProgressId);

            subtaskInProgress.Status = SubtaskInProgressStatus.Cancelled;

            await _dbContext.SaveChangesAsync();
        }
    }
}
