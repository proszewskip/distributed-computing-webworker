using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Server.Models;

namespace Server.Tests
{
    public class TestDbContext : DistributedComputingDbContext
    {
        public TestDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.ConfigureWarnings(warningsConfigurationBuilder =>
            {
                warningsConfigurationBuilder.Ignore(InMemoryEventId.TransactionIgnoredWarning);
            });
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ignore string[] properties as those are not supported when using InMemoryDatabase
            modelBuilder.Entity<DistributedTask>().Ignore(distributedTask => distributedTask.Errors);
            modelBuilder.Entity<SubtaskInProgress>().Ignore(subtaskInProgress => subtaskInProgress.Errors);
            modelBuilder.Entity<Subtask>().Ignore(subtask => subtask.Errors);
        }
    }
}
