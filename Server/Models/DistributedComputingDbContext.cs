using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Server.Models
{
    public class DistributedComputingDbContext : IdentityDbContext<IdentityUser>
    {
        public DistributedComputingDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<DistributedTaskDefinition>().OwnsOne(p => p.ProblemPluginInfo);
            modelBuilder.Entity<DistributedTaskDefinition>().HasIndex(definition => definition.Name).IsUnique();

            modelBuilder.Entity<DistributedTask>().HasIndex(task => task.Name).IsUnique();
        }

        public DbSet<DistributedTaskDefinition> DistributedTaskDefinitions { get; set; }

        public DbSet<DistributedTask> DistributedTasks { get; set; }

        public DbSet<Subtask> Subtasks { get; set; }

        public DbSet<SubtaskInProgress> SubtasksInProgress { get; set; }

        public DbSet<DistributedNode> DistributedNodes { get; set; }
    }
}
