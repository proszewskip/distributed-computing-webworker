using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;
using Server.Models;
using Server.Services.Api;
using Server.Services.Cleanup;

namespace Server.Tests.Services.Cleanup
{
    [TestFixture]
    public class DistributedNodesCleanerTests
    {
        [Test]
        public async Task CleanAsync_Should_MarkSubtasksInProgressAsCancelled()
        {
            var dbContextOptions = DbContextOptionsFactory.CreateOptions("Mark_subtasks_as_cancelled");

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var distributedNodeId = Guid.NewGuid();
                dbContext.DistributedNodes.Add(new DistributedNode()
                {
                    Id = distributedNodeId,
                    LastKeepAliveTime = DateTime.Now.Subtract(TimeSpan.FromMinutes(5)),
                    SubtasksInProgress = new List<SubtaskInProgress>()
                    {
                        new SubtaskInProgress()
                        {
                            Id = 1,
                            NodeId = distributedNodeId,
                            Status = SubtaskInProgressStatus.Executing
                        },
                        new SubtaskInProgress()
                        {
                            Id = 2,
                            NodeId = distributedNodeId,
                            Status = SubtaskInProgressStatus.Done
                        },
                        new SubtaskInProgress()
                        {
                            Id = 3,
                            NodeId = distributedNodeId,
                            Status = SubtaskInProgressStatus.Executing
                        }
                    }
                });
                dbContext.DistributedNodes.Add(new DistributedNode()
                {
                    Id = Guid.NewGuid(),
                    LastKeepAliveTime = DateTime.Now.Subtract(TimeSpan.FromMinutes(5)),
                    SubtasksInProgress = new List<SubtaskInProgress>()
                    {
                        new SubtaskInProgress()
                        {
                            Id = 4,
                            Status = SubtaskInProgressStatus.Error
                        },
                    }
                });

                await dbContext.SaveChangesAsync();
            }

            var computationCancelServiceMock = new Mock<IComputationCancelService>();
            computationCancelServiceMock.Setup(service => service.CancelSubtaskInProgressAsync(1))
                .Returns(Task.CompletedTask)
                .Verifiable();
            computationCancelServiceMock.Setup(service => service.CancelSubtaskInProgressAsync(3))
                .Returns(Task.CompletedTask)
                .Verifiable();

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var cleaner = new DistributedNodesCleaner(dbContext, computationCancelServiceMock.Object,
                    TimeSpan.FromSeconds(1));

                await cleaner.CleanAsync();
            }

            computationCancelServiceMock.Verify(service => service.CancelSubtaskInProgressAsync(1));
            computationCancelServiceMock.Verify(service => service.CancelSubtaskInProgressAsync(3));
            computationCancelServiceMock.VerifyNoOtherCalls();

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var distributedNodesCount = await dbContext.DistributedNodes.CountAsync();

                Assert.AreEqual(2, distributedNodesCount);
            }
        }

        [Test]
        public async Task CleanAsync_ShouldNot_ModifySubtasks_When_NodeIsAlive()
        {
            var dbContextOptions = DbContextOptionsFactory.CreateOptions("Not_modify_subtasks_when_node_is_alive");

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var distributedNodeId = Guid.NewGuid();
                dbContext.DistributedNodes.Add(new DistributedNode()
                {
                    Id = distributedNodeId,
                    LastKeepAliveTime = DateTime.Now.Subtract(TimeSpan.FromMinutes(5)),
                    SubtasksInProgress = new List<SubtaskInProgress>()
                    {
                        new SubtaskInProgress()
                        {
                            Id = 1,
                            NodeId = distributedNodeId,
                            Status = SubtaskInProgressStatus.Executing
                        },
                        new SubtaskInProgress()
                        {
                            Id = 2,
                            NodeId = distributedNodeId,
                            Status = SubtaskInProgressStatus.Done
                        },
                        new SubtaskInProgress()
                        {
                            Id = 3,
                            NodeId = distributedNodeId,
                            Status = SubtaskInProgressStatus.Executing
                        }
                    }
                });

                await dbContext.SaveChangesAsync();
            }

            var computationCancelServiceMock = new Mock<IComputationCancelService>();
            computationCancelServiceMock.Setup(service => service.CancelSubtaskInProgressAsync(It.IsAny<int>()))
                .Returns(Task.CompletedTask);

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var cleaner = new DistributedNodesCleaner(dbContext, computationCancelServiceMock.Object,
                    TimeSpan.FromMinutes(60));

                await cleaner.CleanAsync();
            }

            computationCancelServiceMock.VerifyNoOtherCalls();

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var distributedNodesCount = await dbContext.DistributedNodes.CountAsync();

                Assert.AreEqual(1, distributedNodesCount);
            }
        }

        [Test]
        public async Task CleanAsync_Should_RemoveNode_When_OnlyCancelledTasks()
        {
            var dbContextOptions = DbContextOptionsFactory.CreateOptions("Remove_node_when_only_cancelled_tasks");

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var distributedNodeId = Guid.NewGuid();
                dbContext.DistributedNodes.Add(new DistributedNode()
                {
                    Id = distributedNodeId,
                    LastKeepAliveTime = DateTime.Now.Subtract(TimeSpan.FromMinutes(5)),
                    SubtasksInProgress = new List<SubtaskInProgress>()
                    {
                        new SubtaskInProgress()
                        {
                            Id = 1,
                            NodeId = distributedNodeId,
                            Status = SubtaskInProgressStatus.Executing
                        },
                        new SubtaskInProgress()
                        {
                            Id = 2,
                            NodeId = distributedNodeId,
                            Status = SubtaskInProgressStatus.Executing
                        },
                        new SubtaskInProgress()
                        {
                            Id = 3,
                            NodeId = distributedNodeId,
                            Status = SubtaskInProgressStatus.Cancelled
                        }
                    }
                });

                await dbContext.SaveChangesAsync();
            }

            var computationCancelServiceMock = new Mock<IComputationCancelService>();
            computationCancelServiceMock.Setup(service => service.CancelSubtaskInProgressAsync(It.IsAny<int>()))
                .Returns(Task.CompletedTask);

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var cleaner = new DistributedNodesCleaner(dbContext, computationCancelServiceMock.Object,
                    TimeSpan.FromSeconds(5));

                await cleaner.CleanAsync();
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var distributedNodesCount = await dbContext.DistributedNodes.CountAsync();

                Assert.AreEqual(0, distributedNodesCount);
            }
        }
    }
}
