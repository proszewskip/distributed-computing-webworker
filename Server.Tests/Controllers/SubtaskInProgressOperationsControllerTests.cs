using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using NUnit.Framework;
using Server.Controllers;
using Server.DTO;
using Server.Models;
using Server.Services.Api;

namespace Server.Tests.Services.Controllers
{
    public class SubtaskInProgressOperationsControllerTests
    {
        [Test]
        public async Task ReportComputationSuccessAsync_ShouldRejectInvalidNodeId()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var computationFailService =
                services.GetService<IComputationFailService>();
            var computationCompleteService = services.GetService<IComputationCompleteService>();
            var computationCancelService = services.GetService<IComputationCancelService>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var dbContext = services.GetService<DistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskInProgressOperationsController(computationFailService,
                computationCompleteService, computationCancelService, subtaskInProgressResourceService);

            var computationSuccessDTO = new ComputationSuccessDTO
            {
                DistributedNodeId = "!@!@#!#",
                SubtaskInProgressId = 1,
                SubtaskResult = new Mock<IFormFile>().Object
            };

            var result =
                await subtaskOperationsController.ReportComputationSuccessAsync(computationSuccessDTO) as
                    BadRequestResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status400BadRequest, result.StatusCode);
        }

        [Test]
        public async Task ReportComputationSuccessAsync_ShouldRejectNotAssignedNode()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var computationFailService =
                services.GetService<IComputationFailService>();
            var computationCompleteService = services.GetService<IComputationCompleteService>();
            var computationCancelService = services.GetService<IComputationCancelService>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var dbContext = services.GetService<DistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskInProgressOperationsController(computationFailService,
                computationCompleteService, computationCancelService, subtaskInProgressResourceService);

            var computationSuccessDTO = new ComputationSuccessDTO
            {
                DistributedNodeId = Guid.NewGuid().ToString(),
                SubtaskInProgressId = 1,
                SubtaskResult = new Mock<IFormFile>().Object
            };

            var result =
                await subtaskOperationsController.ReportComputationSuccessAsync(computationSuccessDTO) as
                    NotFoundResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status404NotFound, result.StatusCode);
        }

        [Test]
        public async Task ReportComputationSuccessAsync_ShouldRejectWhenSubtaskInProgressStatusIsDone()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var computationFailService =
                services.GetService<IComputationFailService>();
            var computationCompleteService = services.GetService<IComputationCompleteService>();
            var computationCancelService = services.GetService<IComputationCancelService>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var dbContext = services.GetService<DistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskInProgressOperationsController(computationFailService,
                computationCompleteService, computationCancelService, subtaskInProgressResourceService);

            var nodeId = dbContext.DistributedNodes.First().ModelId;

            var computationSuccessDTO = new ComputationSuccessDTO
            {
                DistributedNodeId = nodeId,
                SubtaskInProgressId = 3,
                SubtaskResult = new Mock<IFormFile>().Object
            };

            var result =
                await subtaskOperationsController.ReportComputationSuccessAsync(computationSuccessDTO) as
                    NotFoundResult;


            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status404NotFound, result.StatusCode);
        }


        [Test]
        public async Task ReportComputationSuccessAsync_ShouldRejectWhenSubtaskInProgressStatusIsCancelled()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var computationFailService =
                services.GetService<IComputationFailService>();
            var computationCompleteService = services.GetService<IComputationCompleteService>();
            var computationCancelService = services.GetService<IComputationCancelService>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var dbContext = services.GetService<DistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskInProgressOperationsController(computationFailService,
                computationCompleteService, computationCancelService, subtaskInProgressResourceService);

            var nodeId = dbContext.DistributedNodes.First().ModelId;

            var computationSuccessDTO = new ComputationSuccessDTO
            {
                DistributedNodeId = nodeId,
                SubtaskInProgressId = 2,
                SubtaskResult = new Mock<IFormFile>().Object
            };

            var result =
                await subtaskOperationsController.ReportComputationSuccessAsync(computationSuccessDTO) as
                    NotFoundResult;


            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status404NotFound, result.StatusCode);
        }

        [Test]
        public async Task ReportComputationSuccessAsync_ShouldRejectWhenSubtaskInProgressStatusIsError()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var computationFailService =
                services.GetService<IComputationFailService>();
            var computationCompleteService = services.GetService<IComputationCompleteService>();
            var computationCancelService = services.GetService<IComputationCancelService>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var dbContext = services.GetService<DistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskInProgressOperationsController(computationFailService,
                computationCompleteService, computationCancelService, subtaskInProgressResourceService);

            var nodeId = dbContext.DistributedNodes.First().ModelId;

            var computationSuccessDTO = new ComputationSuccessDTO
            {
                DistributedNodeId = nodeId,
                SubtaskInProgressId = 4,
                SubtaskResult = new Mock<IFormFile>().Object
            };

            var result =
                await subtaskOperationsController.ReportComputationSuccessAsync(computationSuccessDTO) as
                    NotFoundResult;


            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status404NotFound, result.StatusCode);
        }


        [Test]
        public async Task ReportComputationSuccessAsync_ShouldAcceptCorrectData()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var computationFailService =
                services.GetService<IComputationFailService>();
            var computationCompleteService = services.GetService<IComputationCompleteService>();
            var computationCancelService = services.GetService<IComputationCancelService>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var dbContext = services.GetService<DistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskInProgressOperationsController(computationFailService,
                computationCompleteService, computationCancelService, subtaskInProgressResourceService);

            var nodeId = dbContext.DistributedNodes.First().ModelId;

            var subtaskInProgressResult = new Mock<IFormFile>();
            var ms = new MemoryStream();
            var writer = new StreamWriter(ms);
            writer.Write("results");
            writer.Flush();
            ms.Position = 0;
            subtaskInProgressResult.Setup(_ => _.OpenReadStream()).Returns(ms);
            subtaskInProgressResult.Setup(_ => _.Length).Returns(ms.Length);

            var computationSuccessDTO = new ComputationSuccessDTO
            {
                DistributedNodeId = nodeId,
                SubtaskInProgressId = 1,
                SubtaskResult = subtaskInProgressResult.Object
            };

            var result =
                await subtaskOperationsController.ReportComputationSuccessAsync(computationSuccessDTO) as
                    OkResult;


            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status200OK, result.StatusCode);
        }

        [Test]
        public async Task ReportComputationErrorAsync_ShouldRejectInvalidNodeId()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var computationFailService =
                services.GetService<IComputationFailService>();
            var computationCompleteService = services.GetService<IComputationCompleteService>();
            var computationCancelService = services.GetService<IComputationCancelService>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var dbContext = services.GetService<DistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskInProgressOperationsController(computationFailService,
                computationCompleteService, computationCancelService, subtaskInProgressResourceService);

            var computationErrorDto = new ComputationErrorDTO
            {
                DistributedNodeId = "!@!@#!#",
                SubtaskInProgressId = 1,
                Errors = null
            };

            var result =
                await subtaskOperationsController.ReportComputationErrorAsync(computationErrorDto) as
                    BadRequestResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status400BadRequest, result.StatusCode);
        }

        [Test]
        public async Task ReportComputationErrorAsync_ShouldRejectNotAssignedNode()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var computationFailService =
                services.GetService<IComputationFailService>();
            var computationCompleteService = services.GetService<IComputationCompleteService>();
            var computationCancelService = services.GetService<IComputationCancelService>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var dbContext = services.GetService<DistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskInProgressOperationsController(computationFailService,
                computationCompleteService, computationCancelService, subtaskInProgressResourceService);

            var computationErrorDTO = new ComputationErrorDTO
            {
                DistributedNodeId = new Guid().ToString(),
                SubtaskInProgressId = 1,
                Errors = null
            };

            var result =
                await subtaskOperationsController.ReportComputationErrorAsync(computationErrorDTO) as
                    NotFoundResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status404NotFound, result.StatusCode);
        }

        [Test]
        public async Task ReportComputationErrorAsync_ShouldAcceptCorrectData()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var computationFailService =
                services.GetService<IComputationFailService>();
            var computationCompleteService = services.GetService<IComputationCompleteService>();
            var computationCancelService = services.GetService<IComputationCancelService>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var dbContext = services.GetService<DistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskInProgressOperationsController(computationFailService,
                computationCompleteService, computationCancelService, subtaskInProgressResourceService);

            var nodeId = dbContext.DistributedNodes.First().ModelId;

            var subtaskInProgressResult = new Mock<IFormFile>();
            var memoryStream = new MemoryStream();
            var streamWriter = new StreamWriter(memoryStream);
            streamWriter.Write("results");
            streamWriter.Flush();
            memoryStream.Position = 0;
            subtaskInProgressResult.Setup(_ => _.OpenReadStream()).Returns(memoryStream);
            subtaskInProgressResult.Setup(_ => _.Length).Returns(memoryStream.Length);

            var computationErrorDTO = new ComputationErrorDTO
            {
                DistributedNodeId = nodeId,
                SubtaskInProgressId = 1,
                Errors = new[] {"A", "B"}
            };

            var result =
                await subtaskOperationsController.ReportComputationErrorAsync(computationErrorDTO) as
                    OkResult;


            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status200OK, result.StatusCode);
        }

        [Test]
        public async Task CancelComputationAsync_ShouldRejectNotAssignedNode()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var computationFailService =
                services.GetService<IComputationFailService>();
            var computationCompleteService = services.GetService<IComputationCompleteService>();
            var computationCancelService = services.GetService<IComputationCancelService>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var dbContext = services.GetService<DistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskInProgressOperationsController(computationFailService,
                computationCompleteService, computationCancelService, subtaskInProgressResourceService);

            var computationCancelDTO = new ComputationCancelDTO
            {
                DistributedNodeId = Guid.NewGuid().ToString(),
                SubtaskInProgressId = 1
            };

            var result =
                await subtaskOperationsController.CancelComputationAsync(computationCancelDTO) as
                    NotFoundResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status404NotFound, result.StatusCode);
        }

        [Test]
        public async Task CancelComputationAsync_ShouldAcceptCorrectData()
        {
            var testServer = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());

            var services = testServer.Host.Services;
            var computationFailService =
                services.GetService<IComputationFailService>();
            var computationCompleteService = services.GetService<IComputationCompleteService>();
            var computationCancelService = services.GetService<IComputationCancelService>();
            var subtaskInProgressResourceService = services.GetService<IResourceService<SubtaskInProgress>>();
            var dbContext = services.GetService<DistributedComputingDbContext>();

            await CreateMockData(dbContext);

            var subtaskOperationsController = new SubtaskInProgressOperationsController(computationFailService,
                computationCompleteService, computationCancelService, subtaskInProgressResourceService);

            var nodeId = dbContext.DistributedNodes.First().ModelId;

            var computationCancelDTO = new ComputationCancelDTO
            {
                DistributedNodeId = nodeId,
                SubtaskInProgressId = 1
            };

            var result =
                await subtaskOperationsController.CancelComputationAsync(computationCancelDTO) as
                    OkResult;


            Assert.IsNotNull(result);
            Assert.AreEqual(StatusCodes.Status200OK, result.StatusCode);
        }


        private static async Task CreateMockData(DistributedComputingDbContext dbContext)
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
                        SubtasksInProgress = new List<SubtaskInProgress>
                        {
                            new SubtaskInProgress
                            {
                                Id = 1,
                                SubtaskId = 1,
                                Status = SubtaskInProgressStatus.Executing,
                                Node = new DistributedNode
                                {
                                    TrustLevel = 1
                                }
                            },
                            new SubtaskInProgress
                            {
                                Id = 2,
                                SubtaskId = 1,
                                Status = SubtaskInProgressStatus.Cancelled,
                                Node = new DistributedNode
                                {
                                    TrustLevel = 1
                                }
                            },
                            new SubtaskInProgress
                            {
                                Id = 3,
                                SubtaskId = 1,
                                Status = SubtaskInProgressStatus.Done,
                                Node = new DistributedNode
                                {
                                    TrustLevel = 1
                                }
                            },
                            new SubtaskInProgress
                            {
                                Id = 4,
                                SubtaskId = 1,
                                Status = SubtaskInProgressStatus.Error,
                                Node = new DistributedNode
                                {
                                    TrustLevel = 1
                                }
                            }
                        },
                        Status = SubtaskStatus.Executing
                    }
                },
                DistributedTaskDefinition = new DistributedTaskDefinition
                {
                    DefinitionGuid = Guid.NewGuid(),
                    Id = 1
                },
                Id = 1,
                Status = DistributedTaskStatus.InProgress,
                TrustLevelToComplete = 10
            });

            await dbContext.SaveChangesAsync();
        }
    }
}
