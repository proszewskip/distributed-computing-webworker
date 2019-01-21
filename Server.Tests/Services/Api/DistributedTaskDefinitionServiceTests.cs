using System.Threading.Tasks;
using JsonApiDotNetCore.Data;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NUnit.Framework;
using Server.Models;
using Server.Services.Api;

namespace Server.Tests.Services.Api
{
    internal class DistributedTaskDefinitionServiceTests
    {
        [Test]
        public async Task CreateAsync_ShouldAcceptUniqueName()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var jsonApiContext = services.GetService<IJsonApiContext>();
            var repository = services.GetService<IEntityRepository<DistributedTaskDefinition>>();
            var loggerFactory = services.GetService<ILoggerFactory>();
            var dbContext = services.GetService<IDistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var distributedTaskDefinitionService =
                new DistributedTaskDefinitionService(jsonApiContext, repository, loggerFactory, dbContext);


            var distributedTaskDefinition = new DistributedTaskDefinition
            {
                Id = 2,
                Name = "Unique"
            };

            var result = await distributedTaskDefinitionService.CreateAsync(distributedTaskDefinition);
            Assert.IsNotNull(result);

            Assert.AreEqual("Unique", result.Name);
        }

        [Test]
        public async Task CreateAsync_ShouldRejectExistingName()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var jsonApiContext = services.GetService<IJsonApiContext>();
            var repository = services.GetService<IEntityRepository<DistributedTaskDefinition>>();
            var loggerFactory = services.GetService<ILoggerFactory>();
            var dbContext = services.GetService<IDistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var distributedTaskDefinitionService =
                new DistributedTaskDefinitionService(jsonApiContext, repository, loggerFactory, dbContext);


            var distributedTaskDefinition = new DistributedTaskDefinition
            {
                Id = 2,
                Name = "First"
            };

            AsyncTestDelegate createAsync = async () =>
                await distributedTaskDefinitionService.CreateAsync(distributedTaskDefinition);

            Assert.ThrowsAsync<JsonApiException>(createAsync);
        }

        [Test]
        public async Task UpdateAsync_ShouldAcceptUniqueName()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var jsonApiContext = services.GetService<IJsonApiContext>();
            var repository = services.GetService<IEntityRepository<DistributedTaskDefinition>>();
            var loggerFactory = services.GetService<ILoggerFactory>();
            var dbContext = services.GetService<IDistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var distributedTaskDefinitionService =
                new DistributedTaskDefinitionService(jsonApiContext, repository, loggerFactory, dbContext);


            var distributedTaskDefinition = new DistributedTaskDefinition
            {
                Name = "Unique"
            };

            AsyncTestDelegate updateDelegate = async () =>
                await distributedTaskDefinitionService.UpdateAsync(1, distributedTaskDefinition);

            Assert.DoesNotThrowAsync(updateDelegate);
        }

        [Test]
        public async Task UpdateAsync_ShouldAcceptIfNameIsNotModified()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var jsonApiContext = services.GetService<IJsonApiContext>();
            var repository = services.GetService<IEntityRepository<DistributedTaskDefinition>>();
            var loggerFactory = services.GetService<ILoggerFactory>();
            var dbContext = services.GetService<IDistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var distributedTaskDefinitionService =
                new DistributedTaskDefinitionService(jsonApiContext, repository, loggerFactory, dbContext);


            var distributedTaskDefinition = new DistributedTaskDefinition
            {
                Name = "First"
            };

            AsyncTestDelegate updateDelegate = async () =>
                await distributedTaskDefinitionService.UpdateAsync(1, distributedTaskDefinition);

            Assert.DoesNotThrowAsync(updateDelegate);
        }


        private static async Task CreateMockData(IDistributedComputingDbContext dbContext)
        {
            dbContext.DistributedTaskDefinitions.Add(new DistributedTaskDefinition
            {
                Id = 1,
                Name = "First"
            });

            await dbContext.SaveChangesAsync();
        }
    }
}
