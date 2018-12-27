using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Server.Models;
using Server.Services.Api;

namespace Server.Tests.Services.Api
{
    [TestFixture]
    public class ComputationFailServiceTests
    {
        [Test]
        public async Task FailSubtaskInProgressAsync_Should_MarkSubtaskInProgressAsError()
        {
            var dbContextOptions = DbContextOptionsFactory.CreateOptions("Mark_subtask_as_error");
            using (var dbContext = new TestDbContext(dbContextOptions))
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
                                    Status = SubtaskStatus.Executing
                                }
                            },
                            Status = SubtaskStatus.Executing
                        }
                    },
                    Id = 1,
                    Name = "Task",
                    Status = DistributedTaskStatus.InProgress
                });

                await dbContext.SaveChangesAsync();
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var computationFailService = new ComputationFailService(dbContext);

                await computationFailService.FailSubtaskInProgressAsync(1, new[] {"Some error"});
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var foundSubtaskInProgress = await dbContext.SubtasksInProgress
                    .Include(subtaskInProgress => subtaskInProgress.Subtask)
                    .FirstAsync(subtaskInProgress => subtaskInProgress.Id == 1);

                Assert.AreEqual(SubtaskStatus.Error, foundSubtaskInProgress.Status);
                Assert.AreEqual(SubtaskStatus.Executing, foundSubtaskInProgress.Subtask.Status);
            }
        }

        [Test]
        public async Task
            FailSubtaskInProgressAsync_Should_MarkDistributedTaskAsError_WhenMultipleSubtasksInProgressFailed()
        {
            var dbContextOptions = DbContextOptionsFactory.CreateOptions("Mark_distributed task_as_error");
            using (var dbContext = new TestDbContext(dbContextOptions))
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
                                    Status = SubtaskStatus.Error
                                },
                                new SubtaskInProgress()
                                {
                                    Id = 2,
                                    SubtaskId = 1,
                                    Status = SubtaskStatus.Executing
                                }
                            },
                            Status = SubtaskStatus.Executing
                        },
                    },
                    Id = 1,
                    Name = "Task",
                    Status = DistributedTaskStatus.InProgress
                });

                await dbContext.SaveChangesAsync();
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var computationFailService = new ComputationFailService(dbContext);

                await computationFailService.FailSubtaskInProgressAsync(2, new[] {"Some error"});
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var foundSubtaskInProgress = await dbContext.SubtasksInProgress
                    .Include(subtaskInProgress => subtaskInProgress.Subtask)
                    .ThenInclude(subtask => subtask.DistributedTask)
                    .FirstAsync(subtaskInProgress => subtaskInProgress.Id == 1);

                Assert.AreEqual(SubtaskStatus.Error, foundSubtaskInProgress.Status);
                Assert.AreEqual(SubtaskStatus.Error, foundSubtaskInProgress.Subtask.Status);
                Assert.AreEqual(DistributedTaskStatus.Error, foundSubtaskInProgress.Subtask.DistributedTask.Status);
            }
        }
    }
}
