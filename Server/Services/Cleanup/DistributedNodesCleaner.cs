using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Services.Api;

namespace Server.Services.Cleanup
{
    public interface IDistributedNodesCleaner
    {
        /// <summary>
        /// Cancels currently executed subtasks of stale distributed nodes
        /// (those, which did not send a keep alive in a specific time window)
        /// and possibly removes them if they have not completed any other subtask.
        /// </summary>
        /// <returns></returns>
        Task CleanAsync();
    }

    public class DistributedNodesCleaner : IDistributedNodesCleaner
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IComputationCancelService _computationCancelService;
        private readonly TimeSpan _distributedNodeLifetime;

        public DistributedNodesCleaner(DistributedComputingDbContext dbContext,
            IComputationCancelService computationCancelService,
            TimeSpan distributedNodeLifetime)
        {
            _dbContext = dbContext;
            _computationCancelService = computationCancelService;
            _distributedNodeLifetime = distributedNodeLifetime;
        }

        public async Task CleanAsync()
        {
            var nodeExpirationDateTime = DateTime.Now.Subtract(_distributedNodeLifetime);
            var staleDistributedNodes = await _dbContext.DistributedNodes
                .Where(distributedNode => distributedNode.LastKeepAliveTime < nodeExpirationDateTime)
                .Include(distributedNode => distributedNode.SubtasksInProgress)
                .Select(distributedNode => new
                {
                    DistributedNode = distributedNode,
                    StaleSubtasksInProgress = distributedNode.SubtasksInProgress.Where(subtaskInProgress =>
                        subtaskInProgress.Status == SubtaskInProgressStatus.Executing
                    ).ToList(),
                    ShouldBeRemoved = distributedNode.SubtasksInProgress.All(subtaskInProgress =>
                        subtaskInProgress.Status == SubtaskInProgressStatus.Cancelled ||
                        subtaskInProgress.Status == SubtaskInProgressStatus.Error ||
                        subtaskInProgress.Status == SubtaskInProgressStatus.Executing
                    )
                })
                .ToListAsync();

            await Task.WhenAll(
                staleDistributedNodes.Select(async staleDistributedNode =>
                {
                    await Task.WhenAll(
                        staleDistributedNode.StaleSubtasksInProgress.Select(
                            subtaskInProgress =>
                                _computationCancelService.CancelSubtaskInProgressWithoutSavingAsync(subtaskInProgress.Id)
                        )
                    );

                    if (staleDistributedNode.ShouldBeRemoved)
                    {
                        _dbContext.DistributedNodes.Remove(staleDistributedNode.DistributedNode);
                    }
                }));

            await _dbContext.SaveChangesAsync();
        }
    }
}
