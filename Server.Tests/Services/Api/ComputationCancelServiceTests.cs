using System.Threading.Tasks;
using NUnit.Framework;
using Server.Models;
using Server.Services.Api;

namespace Server.Tests.Services.Api
{
    [TestFixture]
    public class ComputationCancelServiceTests
    {
        [Test]
        public async Task CancelSubtaskInProgressAsync_Should_SetSubtaskInProgressStatusToCancelled()
        {
            var dbContextOptions = DbContextOptionsFactory.CreateOptions("Cancel_subtask_in_progress");

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                await dbContext.SubtasksInProgress.AddAsync(new SubtaskInProgress()
                {
                    Id = 1,
                    Status = SubtaskInProgressStatus.Executing
                });

                await dbContext.SaveChangesAsync();
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var computationCancelService = new ComputationCancelService(dbContext);

                await computationCancelService.CancelSubtaskInProgressAsync(1);
            }

            using (var dbContext = new TestDbContext(dbContextOptions))
            {
                var subtaskInProgress = await dbContext.SubtasksInProgress.FindAsync(1);

                Assert.AreEqual(SubtaskInProgressStatus.Cancelled, subtaskInProgress.Status);
            }
        }
    }
}
