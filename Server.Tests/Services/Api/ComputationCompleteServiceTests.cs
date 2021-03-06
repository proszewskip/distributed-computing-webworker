using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;
using Server.Models;
using Server.Services;
using Server.Services.Api;
using Server.Services.Cleanup;

namespace Server.Tests.Services.Api
{
    [TestFixture]
    public class ComputationCompleteServiceTests
    {
        [Test]
        public async Task CompleteSubtaskInProgressAsync_Should_MarkDistributedTaskAsDone_When_NoOtherSubtasksLeft()
        {
            var dbContextOptions = DbContextOptionsFactory.CreateOptions("Mark_distributed_task_as_done");
            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                await CreateMockData(dbContext);
                await dbContext.SaveChangesAsync();
            }

            var problemPluginFacadeMock = new Mock<IProblemPluginFacade>();
            problemPluginFacadeMock.Setup(facade => facade.JoinSubtaskResults(It.IsAny<IEnumerable<byte[]>>()))
                .Returns(new byte[] {1, 2, 3});

            var problemPluginFacadeProviderMock = new Mock<IProblemPluginFacadeProvider>();

            problemPluginFacadeProviderMock.Setup(provider =>
                    provider.Provide(
                        It.Is<DistributedTaskDefinition>(taskDefinition => taskDefinition.Name == "Task definition")))
                .Returns(() => problemPluginFacadeMock.Object);

            var subtaskInProgressCleanupServiceMock = new Mock<ISubtasksInProgressCleanupService>();
            subtaskInProgressCleanupServiceMock.Setup(service => service.RemoveSubtasksInProgress(It.IsAny<int>()));

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var computationCompleteService =
                    new ComputationCompleteService(dbContext, problemPluginFacadeProviderMock.Object,
                        subtaskInProgressCleanupServiceMock.Object);

                using (var stream = new MemoryStream(new byte[] {4, 5, 6}))
                {
                    await computationCompleteService.CompleteSubtaskInProgressAsync(1, stream);
                }
            }

            problemPluginFacadeProviderMock.Verify(provider => provider.Provide(It.IsAny<DistributedTaskDefinition>()),
                Times.Once);
            problemPluginFacadeMock.Verify(facade => facade.JoinSubtaskResults(It.IsAny<IEnumerable<byte[]>>()),
                Times.Once);

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var foundSubtask = await dbContext.Subtasks
                    .Include(subtask => subtask.DistributedTask)
                    .Include(subtask => subtask.SubtasksInProgress)
                    .FirstAsync(subtask => subtask.Id == 1);

                Assert.AreEqual(SubtaskStatus.Done, foundSubtask.Status);
                Assert.AreEqual(DistributedTaskStatus.Done, foundSubtask.DistributedTask.Status);
            }
        }

        [Test]
        public async Task CompleteSubtaskInProgressAsync_Should_MarkSubtaskAsDone_When_TrustLevelReached()
        {
            var dbContextOptions = DbContextOptionsFactory.CreateOptions("Mark_subtask_as_done");
            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                await CreateMockData(dbContext);
                dbContext.Subtasks.Add(new Subtask()
                {
                    DistributedTaskId = 1,
                    Id = 2,
                    SequenceNumber = 1,
                });
                await dbContext.SaveChangesAsync();
            }


            var problemPluginFacadeProviderMock = new Mock<IProblemPluginFacadeProvider>();

            var subtaskInProgressCleanupServiceMock = new Mock<ISubtasksInProgressCleanupService>();
            subtaskInProgressCleanupServiceMock.Setup(service => service.RemoveSubtasksInProgress(It.IsAny<int>()));

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                if (subtaskInProgressCleanupServiceMock.Object != null)
                {
                    var computationCompleteService =
                        new ComputationCompleteService(dbContext, problemPluginFacadeProviderMock.Object,
                            subtaskInProgressCleanupServiceMock.Object);

                    using (var stream = new MemoryStream(new byte[] {4, 5, 6}))
                    {
                        await computationCompleteService.CompleteSubtaskInProgressAsync(1, stream);
                    }
                }
            }

            subtaskInProgressCleanupServiceMock.Verify(service => service.RemoveSubtasksInProgress(1), Times.Once);

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var foundSubtaskInProgress = await dbContext.SubtasksInProgress
                    .Include(subtaskInProgress => subtaskInProgress.Subtask)
                    .ThenInclude(subtask => subtask.DistributedTask)
                    .FirstAsync(subtaskInProgress => subtaskInProgress.Id == 1);

                Assert.AreEqual(SubtaskInProgressStatus.Done, foundSubtaskInProgress.Status);
                Assert.AreEqual(SubtaskStatus.Done, foundSubtaskInProgress.Subtask.Status);
                Assert.AreEqual(DistributedTaskStatus.InProgress,
                    foundSubtaskInProgress.Subtask.DistributedTask.Status);
            }
        }

        [Test]
        public async Task CompleteSubtaskInProgressAsync_ShouldNot_MarkSubtaskAsDone_When_TrustLevelNotReached()
        {
            var dbContextOptions = DbContextOptionsFactory.CreateOptions("Not_mark_subtask_as_done");
            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                await CreateMockData(dbContext);
                var distributedTask = await dbContext.DistributedTasks.FindAsync(1);
                distributedTask.TrustLevelToComplete = 5;
                await dbContext.SaveChangesAsync();
            }


            var problemPluginFacadeProviderMock = new Mock<IProblemPluginFacadeProvider>();

            var subtaskInProgressCleanupServiceMock = new Mock<ISubtasksInProgressCleanupService>();

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var computationCompleteService =
                    new ComputationCompleteService(dbContext, problemPluginFacadeProviderMock.Object,
                        subtaskInProgressCleanupServiceMock.Object);

                using (var stream = new MemoryStream(new byte[] {4, 5, 6}))
                {
                    await computationCompleteService.CompleteSubtaskInProgressAsync(1, stream);
                }
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var foundSubtaskInProgress = await dbContext.SubtasksInProgress
                    .Include(subtaskInProgress => subtaskInProgress.Subtask)
                    .ThenInclude(subtask => subtask.DistributedTask)
                    .FirstAsync(subtaskInProgress => subtaskInProgress.Id == 1);

                Assert.AreEqual(SubtaskInProgressStatus.Done, foundSubtaskInProgress.Status);
                Assert.AreEqual(SubtaskStatus.Executing, foundSubtaskInProgress.Subtask.Status);
                Assert.AreEqual(DistributedTaskStatus.InProgress,
                    foundSubtaskInProgress.Subtask.DistributedTask.Status);
            }
        }

        [Test]
        public async Task CompleteSubtaskInProgressAsync_Should_SelectMostTrustedResult_When_TrustLevelReached()
        {
            var dbContextOptions = DbContextOptionsFactory.CreateOptions("Select_most_trusted_result");
            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                await CreateMockData(dbContext);
                dbContext.Subtasks.Add(new Subtask()
                {
                    DistributedTaskId = 1,
                    Id = 2,
                    SequenceNumber = 1,
                });
                dbContext.SubtasksInProgress.AddRange(new SubtaskInProgress()
                {
                    Id = 2,
                    SubtaskId = 1,
                    Node = new DistributedNode()
                    {
                        TrustLevel = 5,
                    },
                    Result = new byte[] {1, 2, 3},
                    Status = SubtaskInProgressStatus.Done,
                }, new SubtaskInProgress()
                {
                    Id = 3,
                    SubtaskId = 1,
                    Node = new DistributedNode()
                    {
                        TrustLevel = 3,
                    },
                    Result = new byte[] {4, 5, 6},
                    Status = SubtaskInProgressStatus.Done,
                });
                await dbContext.SaveChangesAsync();
            }


            var problemPluginFacadeProviderMock = new Mock<IProblemPluginFacadeProvider>();

            var subtaskInProgressCleanupServiceMock = new Mock<ISubtasksInProgressCleanupService>();
            subtaskInProgressCleanupServiceMock.Setup(service => service.RemoveSubtasksInProgress(It.IsAny<int>()));

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var computationCompleteService =
                    new ComputationCompleteService(dbContext, problemPluginFacadeProviderMock.Object,
                        subtaskInProgressCleanupServiceMock.Object);

                using (var stream = new MemoryStream(new byte[] {4, 5, 6}))
                {
                    await computationCompleteService.CompleteSubtaskInProgressAsync(1, stream);
                }
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var foundSubtask = await dbContext.Subtasks
                    .FirstAsync(subtask => subtask.Id == 1);

                Assert.AreEqual(new byte[] {1, 2, 3}, foundSubtask.Result);
            }
        }

        private static async Task CreateMockData(TestDbContext dbContext)
        {
            dbContext.DistributedTasks.Add(new DistributedTask()
            {
                Subtasks = new List<Subtask>()
                {
                    new Subtask()
                    {
                        DistributedTaskId = 1,
                        Id = 1,
                        SequenceNumber = 0,
                        SubtasksInProgress = new List<SubtaskInProgress>()
                        {
                            new SubtaskInProgress()
                            {
                                Id = 1,
                                SubtaskId = 1,
                                Status = SubtaskInProgressStatus.Executing,
                                Node = new DistributedNode()
                                {
                                    TrustLevel = 1
                                }
                            }
                        },
                        Status = SubtaskStatus.Executing
                    }
                },
                DistributedTaskDefinition = new DistributedTaskDefinition()
                {
                    DefinitionGuid = Guid.NewGuid(),
                    Id = 1,
                    Name = "Task definition",
                    MainDllName = "task definition.dll",
                },
                Id = 1,
                Name = "Task",
                Status = DistributedTaskStatus.InProgress,
                TrustLevelToComplete = 1
            });

            await dbContext.SaveChangesAsync();
        }
    }
}
