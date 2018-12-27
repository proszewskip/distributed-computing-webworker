using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Services.Api
{
    public interface IGetNextSubtaskToComputeService
    {
        Task<Subtask> GetNextSubtaskAsync();
    }

    public class GetNextSubtaskToComputeService : IGetNextSubtaskToComputeService
    {
        private readonly DistributedComputingDbContext _dbContext;

        public GetNextSubtaskToComputeService(
            DistributedComputingDbContext dbContext
        )
        {
            _dbContext = dbContext;
        }

        public Task<Subtask> GetNextSubtaskAsync()
        {
            return _dbContext.Subtasks.OrderByDescending(subtask => subtask.DistributedTask.Priority)
                .FirstOrDefaultAsync(subtask =>
                    (subtask.Status == SubtaskStatus.WaitingForExecution ||
                     subtask.Status == SubtaskStatus.Executing) &&
                    subtask.DistributedTask.Status == DistributedTaskStatus.InProgress &&
                    (!subtask.SubtasksInProgress.Any() ||
                     subtask.SubtasksInProgress
                         .Where(subtaskInProgress =>
                             subtaskInProgress.Status == SubtaskInProgressStatus.Executing ||
                             subtaskInProgress.Status == SubtaskInProgressStatus.Done)
                         .Sum(subtaskInProgress => subtaskInProgress.Node.TrustLevel)
                     < subtask.DistributedTask.TrustLevelToComplete)
                );
        }
    }
}
