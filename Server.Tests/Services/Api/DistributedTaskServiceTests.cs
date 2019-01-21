using System.Collections.Generic;
using System.Threading.Tasks;
using JsonApiDotNetCore.Data;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using Server.Models;
using Server.Services;
using Server.Services.Api;

namespace Server.Tests.Services.Api
{
    internal class DistributedTaskServiceTests
    {
        [Test]
        public async Task CreateAsync_ShouldAcceptUniqueName()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var jsonApiContext = services.GetService<IJsonApiContext>();
            var repository = services.GetService<IEntityRepository<DistributedTask>>();
            var loggerFactory = services.GetService<ILoggerFactory>();
            var dbContext = services.GetService<DistributedComputingDbContext>();

            var problemPluginFacadeMock = new Mock<IProblemPluginFacade>();
            problemPluginFacadeMock.Setup(_ => _.GetSubtasksFromData(It.IsAny<byte[]>())).Returns(new List<byte[]>());

            var problemPluginFacadeProviderMock = new Mock<IProblemPluginFacadeProvider>();
            problemPluginFacadeProviderMock.Setup(_ => _.Provide(It.IsAny<DistributedTaskDefinition>()))
                .Returns(problemPluginFacadeMock.Object);


            await CreateMockData(dbContext);

            var distributedTaskService =
                new DistributedTaskService(jsonApiContext, repository, loggerFactory, dbContext,
                    problemPluginFacadeProviderMock.Object);


            var distributedTask = new DistributedTask
            {
                Id = 2,
                Name = "Unique",
                DistributedTaskDefinitionId = 1
            };

            var result = await distributedTaskService.CreateAsync(distributedTask);
            Assert.IsNotNull(result);

            Assert.AreEqual("Unique", result.Name);
        }

        [Test]
        public async Task CreateAsync_ShouldRejectExistingName()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var jsonApiContext = services.GetService<IJsonApiContext>();
            var repository = services.GetService<IEntityRepository<DistributedTask>>();
            var loggerFactory = services.GetService<ILoggerFactory>();
            var dbContext = services.GetService<DistributedComputingDbContext>();
            var problemPluginFacadeProvider = services.GetService<IProblemPluginFacadeProvider>();

            await CreateMockData(dbContext);

            var distributedTaskService =
                new DistributedTaskService(jsonApiContext, repository, loggerFactory, dbContext,
                    problemPluginFacadeProvider);


            var distributedTask = new DistributedTask
            {
                Id = 2,
                Name = "First"
            };

            AsyncTestDelegate createAsync = async () =>
                await distributedTaskService.CreateAsync(distributedTask);

            Assert.ThrowsAsync<JsonApiException>(createAsync);
        }

        [Test]
        public async Task UpdateAsync_ShouldAcceptUniqueName()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var jsonApiContext = services.GetService<IJsonApiContext>();
            var repository = services.GetService<IEntityRepository<DistributedTask>>();
            var loggerFactory = services.GetService<ILoggerFactory>();
            var dbContext = services.GetService<DistributedComputingDbContext>();
            var problemPluginFacadeProvider = services.GetService<IProblemPluginFacadeProvider>();

            await CreateMockData(dbContext);

            var distributedTaskService =
                new DistributedTaskService(jsonApiContext, repository, loggerFactory, dbContext,
                    problemPluginFacadeProvider);


            var distributedTask = new DistributedTask
            {
                Name = "Unique"
            };

            AsyncTestDelegate updateDelegate = async () => await distributedTaskService.UpdateAsync(1, distributedTask);

            Assert.DoesNotThrowAsync(updateDelegate);
        }

        [Test]
        public async Task UpdateAsync_ShouldAcceptIfNameIsNotModified()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var jsonApiContext = services.GetService<IJsonApiContext>();
            var repository = services.GetService<IEntityRepository<DistributedTask>>();
            var loggerFactory = services.GetService<ILoggerFactory>();
            var dbContext = services.GetService<DistributedComputingDbContext>();
            var problemPluginFacadeProvider = services.GetService<IProblemPluginFacadeProvider>();

            await CreateMockData(dbContext);

            var distributedTaskService =
                new DistributedTaskService(jsonApiContext, repository, loggerFactory, dbContext,
                    problemPluginFacadeProvider);


            var distributedTask = new DistributedTask
            {
                Name = "First"
            };

            AsyncTestDelegate updateDelegate = async () => await distributedTaskService.UpdateAsync(1, distributedTask);

            Assert.DoesNotThrowAsync(updateDelegate);
        }


        private static async Task CreateMockData(DistributedComputingDbContext dbContext)
        {
            dbContext.DistributedTasks.Add(new DistributedTask
            {
                Id = 1,
                Name = "First",
                DistributedTaskDefinitionId = 1,
                DistributedTaskDefinition = new DistributedTaskDefinition
                {
                    Id = 1
                }
            });

            await dbContext.SaveChangesAsync();
        }
    }
}
