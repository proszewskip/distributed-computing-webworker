using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using Server.Models;
using Server.Services.Api;

namespace Server.Tests.Services.Api
{
    [TestFixture]
    public class GetNextSubtaskToComputeServiceTests
    {
        [Test]
        public async Task GetNextSubtaskAsync_Should_ReturnASubtask()
        {
            var dbContextOptions = DbContextOptionsFactory.CreateOptions("Return_next_subtask");
            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                SeedDistributedTask(dbContext, 1);
                dbContext.Subtasks.Add(new Subtask()
                {
                    Id = 1,
                    DistributedTaskId = 1,
                    Status = SubtaskStatus.WaitingForExecution
                });

                await dbContext.SaveChangesAsync();
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var getNextSubtaskToComputeService = new GetNextSubtaskToComputeService(dbContext);

                var subtask = await getNextSubtaskToComputeService.GetNextSubtaskAsync();

                Assert.AreEqual(1, subtask.Id);
            }
        }

        [Test]
        public async Task GetNextSubtaskAsync_Should_ReturnASubtask_BasedOnDistributedTaskPriority()
        {
            var dbContextOptions = DbContextOptionsFactory.CreateOptions("Return_next_subtask_base_on_priority");
            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                SeedDistributedTask(dbContext, 1);
                dbContext.Subtasks.Add(new Subtask()
                {
                    Id = 1,
                    DistributedTaskId = 1,
                    Status = SubtaskStatus.WaitingForExecution
                });

                SeedDistributedTask(dbContext, 2, priority: 5);
                dbContext.Subtasks.Add(new Subtask()
                {
                    Id = 2,
                    DistributedTaskId = 2,
                    Status = SubtaskStatus.WaitingForExecution
                });

                await dbContext.SaveChangesAsync();
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var getNextSubtaskToComputeService = new GetNextSubtaskToComputeService(dbContext);

                var subtask = await getNextSubtaskToComputeService.GetNextSubtaskAsync();

                Assert.AreEqual(2, subtask.Id);
            }
        }

        [Test]
        public async Task GetNextSubtaskAsync_ShouldNot_ReturnSubtask_When_AllAreDone()
        {
            var dbContextOptions = DbContextOptionsFactory.CreateOptions("Return_next_subtask_when_all_are_done");
            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                SeedDistributedTask(dbContext, 1);
                dbContext.Subtasks.Add(new Subtask()
                {
                    Id = 1,
                    DistributedTaskId = 1,
                    Status = SubtaskStatus.Done
                });
                dbContext.Subtasks.Add(new Subtask()
                {
                    Id = 2,
                    DistributedTaskId = 1,
                    Status = SubtaskStatus.Done
                });

                await dbContext.SaveChangesAsync();
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var getNextSubtaskToComputeService = new GetNextSubtaskToComputeService(dbContext);

                var subtask = await getNextSubtaskToComputeService.GetNextSubtaskAsync();

                Assert.Null(subtask);
            }
        }

        [Test]
        public async Task GetNextSubtaskAsync_ShouldNot_ReturnSubtask_When_DistributedTaskIsNotInProgress()
        {
            var dbContextOptions =
                DbContextOptionsFactory.CreateOptions("Return_next_subtask_when_distributed_task_not_in_progress");
            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                dbContext.DistributedTasks.Add(new DistributedTask()
                {
                    Id = 1,
                    Status = DistributedTaskStatus.Error,
                });
                dbContext.Subtasks.Add(new Subtask()
                {
                    Id = 1,
                    DistributedTaskId = 1,
                    Status = SubtaskStatus.Done
                });

                await dbContext.SaveChangesAsync();
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var getNextSubtaskToComputeService = new GetNextSubtaskToComputeService(dbContext);

                var subtask = await getNextSubtaskToComputeService.GetNextSubtaskAsync();

                Assert.Null(subtask);
            }
        }

        [Test]
        public async Task GetNextSubtaskAsync_ShouldNot_ReturnSubtask_When_TrustLevelAlreadyReached()
        {
            var dbContextOptions =
                DbContextOptionsFactory.CreateOptions("Return_next_subtask_when_trust_level_already_reached");
            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                SeedDistributedTask(dbContext, 1, trustLevelToComplete: 5);
                dbContext.Subtasks.Add(new Subtask()
                {
                    Id = 1,
                    DistributedTaskId = 1,
                    Status = SubtaskStatus.Executing,
                    SubtasksInProgress = new List<SubtaskInProgress>()
                    {
                        new SubtaskInProgress()
                        {
                            Status = SubtaskInProgressStatus.Executing,
                            Id = 1,
                            Node = new DistributedNode()
                            {
                                TrustLevel = 5
                            }
                        }
                    }
                });

                await dbContext.SaveChangesAsync();
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var getNextSubtaskToComputeService = new GetNextSubtaskToComputeService(dbContext);

                var subtask = await getNextSubtaskToComputeService.GetNextSubtaskAsync();

                Assert.Null(subtask);
            }
        }

        [Test]
        public async Task GetNextSubtaskAsync_ShouldNot_ReturnSubtask_When_SubtasksInProgressAreCancelled()
        {
            var dbContextOptions =
                DbContextOptionsFactory.CreateOptions("Return_next_subtask_when_subtasks_in_progress_are_cancelled");
            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                SeedDistributedTask(dbContext, 1);
                dbContext.Subtasks.Add(new Subtask()
                {
                    Id = 1,
                    DistributedTaskId = 1,
                    Status = SubtaskStatus.Executing,
                    SubtasksInProgress = new List<SubtaskInProgress>()
                    {
                        new SubtaskInProgress()
                        {
                            Status = SubtaskInProgressStatus.Cancelled,
                            Id = 1,
                            Node = new DistributedNode()
                            {
                                TrustLevel = 5
                            }
                        },
                        new SubtaskInProgress()
                        {
                            Status = SubtaskInProgressStatus.Cancelled,
                            Id = 2,
                            Node = new DistributedNode()
                            {
                                TrustLevel = 5
                            }
                        }
                    }
                });

                await dbContext.SaveChangesAsync();
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var getNextSubtaskToComputeService = new GetNextSubtaskToComputeService(dbContext);

                var subtask = await getNextSubtaskToComputeService.GetNextSubtaskAsync();

                Assert.NotNull(subtask);
                Assert.AreEqual(1, subtask.Id);
            }
        }

        private static void SeedDistributedTask(TestDbContext dbContext,
            int id,
            int trustLevelToComplete = 1,
            int priority = 1)
        {
            dbContext.DistributedTasks.Add(new DistributedTask()
            {
                Id = id,
                Status = DistributedTaskStatus.InProgress,
                TrustLevelToComplete = trustLevelToComplete,
                Priority = priority,
            });
        }
    }
}
