using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using Server.Controllers;
using Server.DTO;
using Server.Models;
using Server.Services;
using Server.Services.Api;

namespace Server.Tests.Services.Controllers
{
    internal class SubtaskOperationsControllerTests
    {
        [Test]
        public async Task AssignNextAsync_ShouldAssignNextTask()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var getNextSubtaskToComputeService = services.GetService<IGetNextSubtaskToComputeService>();
            var pathsProvider = services.GetService<IPathsProvider>();
            var dbContext = services.GetService<IDistributedComputingDbContext>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var distributedNodeResourceService = services.GetService<IResourceService<DistributedNode, Guid>>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskOperationsController(distributedNodeResourceService,
                subtaskInProgressResourceService, dbContext, getNextSubtaskToComputeService, pathsProvider);

            var nodeId = dbContext.DistributedNodes.First().ModelId;

            var assignNextSubtaskDTO = new AssignNextSubtaskDTO
            {
                DistributedNodeId = nodeId
            };

            var result = await subtaskOperationsController.AssignNextAsync(assignNextSubtaskDTO) as CreatedResult;
            Assert.IsNotNull(result);

            var nextSubtask = result.Value as AssignNextSubtaskResultDTO;

            Assert.IsNotNull(nextSubtask);
            Assert.AreEqual("1", nextSubtask.SubtaskId);
            Assert.IsNotNull(nextSubtask.CompiledTaskDefinitionURL);
            Assert.IsNotNull(nextSubtask.ProblemPluginInfo);
            Assert.IsNotNull(nextSubtask.SubtaskInProgressId);

            Assert.AreEqual(StatusCodes.Status201Created, result.StatusCode);
        }

        [Test]
        public async Task AssignNextAsync_ShouldRejectInvalidNodeId()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var getNextSubtaskToComputeService = services.GetService<IGetNextSubtaskToComputeService>();
            var pathsProvider = services.GetService<IPathsProvider>();
            var dbContext = services.GetService<IDistributedComputingDbContext>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var distributedNodeResourceService = services.GetService<IResourceService<DistributedNode, Guid>>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskOperationsController(distributedNodeResourceService,
                subtaskInProgressResourceService, dbContext, getNextSubtaskToComputeService, pathsProvider);

            var assignNextSubtaskDTO = new AssignNextSubtaskDTO
            {
                DistributedNodeId = "111#"
            };

            var result = await subtaskOperationsController.AssignNextAsync(assignNextSubtaskDTO) as BadRequestResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status400BadRequest, result.StatusCode);
        }

        [Test]
        public async Task AssignNextAsync_ShouldRejectNotRegisteredNode()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var getNextSubtaskToComputeService = services.GetService<IGetNextSubtaskToComputeService>();
            var pathsProvider = services.GetService<IPathsProvider>();
            var dbContext = services.GetService<IDistributedComputingDbContext>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var distributedNodeResourceService = services.GetService<IResourceService<DistributedNode, Guid>>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskOperationsController(distributedNodeResourceService,
                subtaskInProgressResourceService, dbContext, getNextSubtaskToComputeService, pathsProvider);

            var assignNextSubtaskDTO = new AssignNextSubtaskDTO
            {
                DistributedNodeId = Guid.NewGuid().ToString()
            };

            var result = await subtaskOperationsController.AssignNextAsync(assignNextSubtaskDTO) as NotFoundResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status404NotFound, result.StatusCode);
        }

        [Test]
        public async Task AssignNextAsync_ShouldSendNotFoundWhenNoSubtasksAreAvailable()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var getNextSubtaskToComputeService = services.GetService<IGetNextSubtaskToComputeService>();
            var pathsProvider = services.GetService<IPathsProvider>();
            var dbContext = services.GetService<IDistributedComputingDbContext>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var distributedNodeResourceService = services.GetService<IResourceService<DistributedNode, Guid>>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskOperationsController(distributedNodeResourceService,
                subtaskInProgressResourceService, dbContext, getNextSubtaskToComputeService, pathsProvider);

            var nodeId = dbContext.DistributedNodes.First().ModelId;

            var assignNextSubtaskDTO = new AssignNextSubtaskDTO
            {
                DistributedNodeId = nodeId
            };

            await subtaskOperationsController.AssignNextAsync(assignNextSubtaskDTO);
            var result = await subtaskOperationsController.AssignNextAsync(assignNextSubtaskDTO) as NotFoundResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status404NotFound, result.StatusCode);
        }

        private static async Task CreateMockData(IDistributedComputingDbContext dbContext)
        {
            dbContext.DistributedTasks.Add(new DistributedTask
            {
                Subtasks = new List<Subtask>
                {
                    new Subtask
                    {
                        DistributedTaskId = 1,
                        Id = 1,
                        SequenceNumber = 0,
                        SubtasksInProgress = new List<SubtaskInProgress>(),
                        Status = SubtaskStatus.WaitingForExecution
                    }
                },
                DistributedTaskDefinition = new DistributedTaskDefinition
                {
                    DefinitionGuid = Guid.NewGuid(),
                    Id = 1,
                    ProblemPluginInfo = new ProblemPluginInfo
                    {
                        AssemblyName = "a",
                        ClassName = "b",
                        Namespace = "c"
                    }
                },
                Id = 1,
                Status = DistributedTaskStatus.InProgress,
                TrustLevelToComplete = 1,
                Priority = 5
            });

            dbContext.DistributedNodes.Add(new DistributedNode
            {
                Id = Guid.NewGuid(),
                TrustLevel = 1
            });

            await dbContext.SaveChangesAsync();
        }
    }
}
