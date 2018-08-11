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
using Server.Models;

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

            // TODO: use transactions to add task and subtasks
            var distributedTask = await base.CreateAsync(resource);

            try
            {
                var subtasks = CreateSubtasks(taskDefinition, distributedTask);

                await _dbContext.Subtasks.AddRangeAsync(subtasks);
                await _dbContext.SaveChangesAsync();
            }
            catch
            {
                // TODO: handle errors
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

            var parsedTaskData = problemPlugin.ParseTask(distributedTask.InputData);
            var subtasksData = problemPlugin.DivideTask(parsedTaskData);

            return subtasksData.Select((subtaskData, index) => new Subtask
            {
                DistributedTaskId = distributedTask.Id,
                InputData = _dataFormatter.Serialize(subtaskData),
                SequenceNumber = index,
                Status = SubtaskStatus.WaitingForExecution,
                Token = Guid.NewGuid(),
            });
        }
    }
}
