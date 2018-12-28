using Microsoft.EntityFrameworkCore;

namespace Server.Tests
{
    public static class DbContextOptionsFactory
    {
        public static DbContextOptions<TestDbContext> CreateOptions(string databaseName)
        {
            return new DbContextOptionsBuilder<TestDbContext>()
                .UseInMemoryDatabase(databaseName)
                .Options;
        }
    }
}
