using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using JsonApiDotNetCore.Data;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Exceptions;
using Server.Models;
using DistributedComputing;

namespace Server.Services.Api
{
    public class DistributedTaskService : EntityResourceService<DistributedTask>
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IPathsProvider _pathsProvider;
        private readonly IAssemblyLoader _assemblyLoader;
        private readonly IAssemblyAnalyzer _assemblyAnalyzer;
        private readonly IDataFormatter<object> _dataFormatter;

        public DistributedTaskService(
            IJsonApiContext jsonApiContext,
            IEntityRepository<DistributedTask> repository,
            ILoggerFactory loggerFactory,
            DistributedComputingDbContext dbContext,
            IPathsProvider pathsProvider,
            IAssemblyLoader assemblyLoader,
            IAssemblyAnalyzer assemblyAnalyzer,
            IDataFormatter<object> dataFormatter
        ) : base(jsonApiContext, repository, loggerFactory)
        {
            _dbContext = dbContext;
            _pathsProvider = pathsProvider;
            _assemblyLoader = assemblyLoader;
            _assemblyAnalyzer = assemblyAnalyzer;
            _dataFormatter = dataFormatter;
        }

        // TODO: handle InputData file uploads (or another way to send blobs, maybe base64)
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
                    throw new JsonApiException(400, exception.Message, exception);
                }
                catch (TaskDivisionException exception)
                {
                    throw new JsonApiException(400, exception.Message, exception);
                }
                catch (Exception exception)
                {
                    throw new JsonApiException(400, "Cannot create the task", exception);
                }
            }

            return distributedTask;
        }

        public override async Task<DistributedTask> UpdateAsync(int id, DistributedTask resource)
        {
            if (resource.Name != null)
            {
                await EnsureUniqueName(resource.Name);
            }

            return await base.UpdateAsync(id, resource);
        }

        private async Task EnsureUniqueName(string name)
        {
            var taskExists = await _dbContext.DistributedTasks
                .AnyAsync(task => task.Name == name);

            if (taskExists)
            {
                throw new JsonApiException(400, $"A task with the name {name} already exists");
            }
        }

        private async Task<DistributedTaskDefinition> GetTaskDefinitionById(int taskDefinitionId)
        {
            var taskDefinition =
                await _dbContext.DistributedTaskDefinitions.FirstOrDefaultAsync(definition => definition.Id == taskDefinitionId);

            if (taskDefinition == null)
            {
                throw new JsonApiException(400, "The task definition does not exist");
            }

            return taskDefinition;
        }

        private IEnumerable<Subtask> CreateSubtasks(DistributedTaskDefinition taskDefinition, DistributedTask distributedTask)
        {
            var distributedTaskDllPath = Path.Combine(
                _pathsProvider.GetTaskDefinitionDirectoryPath(taskDefinition.DefinitionGuid),
                taskDefinition.MainDllName
            );

            var taskAssembly = _assemblyLoader.LoadAssembly(distributedTaskDllPath);
            var problemPlugin = _assemblyAnalyzer.InstantiateProblemPlugin(taskAssembly);

            var parsedTaskData = ParseTaskData(distributedTask, problemPlugin);
            var subtasksData = DivideTask(problemPlugin, parsedTaskData);

            return subtasksData.Select((subtaskData, index) => new Subtask
            {
                DistributedTaskId = distributedTask.Id,
                InputData = _dataFormatter.Serialize(subtaskData),
                SequenceNumber = index,
                Status = SubtaskStatus.WaitingForExecution,
            });
        }

        private static IEnumerable<object> DivideTask(IProblemPlugin problemPlugin, object parsedTaskData)
        {
            IEnumerable<object> subtasksData;
            try
            {
                subtasksData = problemPlugin.DivideTask(parsedTaskData);
            }
            catch (Exception exception)
            {
                throw new TaskDivisionException(exception);
            }

            return subtasksData;
        }

        private static object ParseTaskData(DistributedTask distributedTask, IProblemPlugin problemPlugin)
        {
            object parsedTaskData;
            try
            {
                parsedTaskData = problemPlugin.ParseTask(distributedTask.InputData);
            }
            catch (Exception exception)
            {
                throw new TaskDataParsingException(exception);
            }

            return parsedTaskData;
        }
    }
}
