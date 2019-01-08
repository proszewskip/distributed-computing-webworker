using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JsonApiDotNetCore.Data;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Exceptions;
using Server.Models;

namespace Server.Services.Api
{
    /// <summary>
    ///     Customized EntityResourceService for DistributedTasks.
    ///     Ensures task name uniqueness and creates subtasks when the task
    ///     is created.
    /// </summary>
    public class DistributedTaskService : EntityResourceService<DistributedTask>
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IProblemPluginFacadeProvider _problemPluginFacadeProvider;

        public DistributedTaskService(
            IJsonApiContext jsonApiContext,
            IEntityRepository<DistributedTask> repository,
            ILoggerFactory loggerFactory,
            DistributedComputingDbContext dbContext,
            IProblemPluginFacadeProvider problemPluginFacadeProvider
        ) : base(jsonApiContext, repository, loggerFactory)
        {
            _dbContext = dbContext;
            _problemPluginFacadeProvider = problemPluginFacadeProvider;
        }

        public override async Task<DistributedTask> CreateAsync(DistributedTask resource)
        {
            var taskDefinition = await GetTaskDefinitionById(resource.DistributedTaskDefinitionId);
            await EnsureUniqueName(resource.Name);

            DistributedTask distributedTask;

            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    distributedTask = await base.CreateAsync(resource);

                    var subtasks = CreateSubtasks(taskDefinition, distributedTask);

                    await _dbContext.Subtasks.AddRangeAsync(subtasks);
                    await _dbContext.SaveChangesAsync();

                    transaction.Commit();
                }
                catch (TaskDataParsingException exception)
                {
                    throw new JsonApiException(StatusCodes.Status400BadRequest, exception.Message, exception);
                }
                catch (TaskDivisionException exception)
                {
                    throw new JsonApiException(StatusCodes.Status400BadRequest, exception.Message, exception);
                }
                catch (Exception exception)
                {
                    throw new JsonApiException(StatusCodes.Status400BadRequest, "Cannot create the task", exception);
                }
            }

            return distributedTask;
        }

        public override async Task<DistributedTask> UpdateAsync(int id, DistributedTask resource)
        {
            if (resource.Name != null) await EnsureUniqueName(resource.Name, id);

            return await base.UpdateAsync(id, resource);
        }

        private async Task EnsureUniqueName(string name, int? id = null)
        {
            var taskExists = await _dbContext.DistributedTasks
                .AnyAsync(task => task.Name == name && (id == null || task.Id != id));

            if (taskExists) throw new JsonApiException(StatusCodes.Status400BadRequest, $"A task with the name {name} already exists");
        }

        private async Task<DistributedTaskDefinition> GetTaskDefinitionById(int taskDefinitionId)
        {
            var taskDefinition =
                await _dbContext.DistributedTaskDefinitions.FirstOrDefaultAsync(definition =>
                    definition.Id == taskDefinitionId);

            if (taskDefinition == null) throw new JsonApiException(StatusCodes.Status400BadRequest, "The task definition does not exist");

            return taskDefinition;
        }

        private IEnumerable<Subtask> CreateSubtasks(DistributedTaskDefinition taskDefinition,
            DistributedTask distributedTask)
        {
            var problemPluginFacade = _problemPluginFacadeProvider.Provide(taskDefinition);

            var subtasksData = problemPluginFacade.GetSubtasksFromData(distributedTask.InputData);

            return subtasksData.Select((subtaskData, index) => new Subtask
            {
                DistributedTaskId = distributedTask.Id,
                InputData = subtaskData,
                SequenceNumber = index,
                Status = SubtaskStatus.WaitingForExecution
            });
        }
    }
}
