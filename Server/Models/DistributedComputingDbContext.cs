using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    public class DistributedComputingDbContext : DbContext
    {
        public DistributedComputingDbContext(DbContextOptions<DistributedComputingDbContext> options) : base(options) { }

        public DbSet<DistributedTaskDefinition> DistributedTaskDefinitions { get; set; }

        public DbSet<DistributedTask> DistributedTasks { get; set; }

        public DbSet<Subtask> Subtasks { get; set; }

    }
}
