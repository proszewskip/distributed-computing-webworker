using System.IO;
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
        private readonly ISubtaskFactoryFactory _subtaskFactoryFactory;
        private readonly IPathsProvider _pathsProvider;
        private readonly IAssemblyLoader _assemblyLoader;
        private readonly IAssemblyAnalyzer _assemblyAnalyzer;

        public DistributedTaskService(
            IJsonApiContext jsonApiContext,
            IEntityRepository<DistributedTask> repository,
            ILoggerFactory loggerFactory,
            DistributedComputingDbContext dbContext,
            ISubtaskFactoryFactory subtaskFactoryFactory,
            IPathsProvider pathsProvider,
            IAssemblyLoader assemblyLoader,
            IAssemblyAnalyzer assemblyAnalyzer
        ) : base(jsonApiContext, repository, loggerFactory)
        {
            _dbContext = dbContext;
            _subtaskFactoryFactory = subtaskFactoryFactory;
            _pathsProvider = pathsProvider;
            _assemblyLoader = assemblyLoader;
            _assemblyAnalyzer = assemblyAnalyzer;
        }

        public override async Task<DistributedTask> CreateAsync(DistributedTask resource)
        {
            var taskDefinition = await GetTaskDefinitionById(resource.DistributedTaskDefinitionId);
            await EnsureUniqueName(resource.Name);

            // TODO: use transactions to add task and subtasks
            var distributedTask = await base.CreateAsync(resource);

            var subtaskFactory = _subtaskFactoryFactory.CreateSubtaskFactory(distributedTask.Id);
            // TODO: use PathsProvider to get the DLL path
            var distributedTaskDllPath = Path.Combine(
                _pathsProvider.TaskDefinitionsDirectoryPath,
                taskDefinition.DefinitionGuid.ToString(),
                taskDefinition.MainDllName
            );

            var taskAssembly = _assemblyLoader.LoadAssembly(distributedTaskDllPath);
            var taskInstance = _assemblyAnalyzer.InstantiateTask(taskAssembly);
            try
            {
                taskInstance.DefineTasks(resource.InputData, subtaskFactory);
            }
            catch
            {
                // TODO: handle errors resulting from defining tasks
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
    }
}
