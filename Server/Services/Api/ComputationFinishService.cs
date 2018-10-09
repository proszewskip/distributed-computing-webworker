using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.DTO;
using Server.Models;

namespace Server.Services.Api
{
    public interface IComputationFinishService
    {
        Task FinishFailedSubtaskAsync(int id, FailedSubtaskDTO succesfulSubtaskDto);
        Task FinishSubtaskInProgressAsync(int id, SuccesfulSubtaskDTO succesfulSubtaskDto);
        Task FinishTaskAsync(int id);
        Task<bool> FinishSubtaskAsync(int id);
    }

    public class ComputationFinishService : IComputationFinishService
    {
        private readonly IAssemblyLoader _assemblyLoader;
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IPathsProvider _pathsProvider;
        private readonly IProblemPluginFacadeFactory _problemPluginFacadeFactory;

        public ComputationFinishService(
            ILoggerFactory loggerFactory,
            DistributedComputingDbContext dbContext,
            IPathsProvider pathsProvider,
            IAssemblyLoader assemblyLoader,
            IProblemPluginFacadeFactory problemPluginFacadeFactory)
        {
            _dbContext = dbContext;
            _pathsProvider = pathsProvider;
            _assemblyLoader = assemblyLoader;
            _problemPluginFacadeFactory = problemPluginFacadeFactory;
        }

        public async Task FinishFailedSubtaskAsync(int id, FailedSubtaskDTO succesfulSubtaskDto)
        {
            var finishedSubtaskInProgress =
                _dbContext.SubtasksInProgress.Include(subtaskInProgress => subtaskInProgress.Subtask)
                    .ThenInclude(subtask => subtask.DistributedTask)
                    .First(subtaskInProgress => subtaskInProgress.Id == id);

            finishedSubtaskInProgress.Errors = succesfulSubtaskDto.Errors;
            finishedSubtaskInProgress.Subtask.Status = SubtaskStatus.Error;
            finishedSubtaskInProgress.Subtask.DistributedTask.Status = DistributedTaskStatus.Error;

            await _dbContext.SaveChangesAsync();
        }

        public async Task FinishSubtaskInProgressAsync(int id, SuccesfulSubtaskDTO succesfulSubtaskDto)
        {
            var finishedSubtaskInProgress =
                _dbContext.SubtasksInProgress.First(subtaskInProgress => subtaskInProgress.Id == id);

            finishedSubtaskInProgress.Status = SubtaskStatus.Done;
            finishedSubtaskInProgress.Result = new byte[succesfulSubtaskDto.SubtaskResult.Length];

            var memoryStream = new MemoryStream(finishedSubtaskInProgress.Result);
            await succesfulSubtaskDto.SubtaskResult.CopyToAsync(memoryStream);

            await _dbContext.SaveChangesAsync();
        }


        public async Task FinishTaskAsync(int id)
        {
            if (!IsTaskFullyComputed(id))
                return;

            var finishedDistributedTask = _dbContext.DistributedTasks
                .Include(distributedTask => distributedTask.DistributedTaskDefinition)
                .First(distributedTask => distributedTask.Id == id);

            var problemPluginFacade =
                GetProblemPluginFacade(finishedDistributedTask.DistributedTaskDefinition.DefinitionGuid,
                    finishedDistributedTask.DistributedTaskDefinition.MainDllName);

            var subtaskResults = _dbContext.Subtasks
                .Where(subtask => subtask.DistributedTaskId == id)
                .Select(subtask => subtask.Result);

            try
            {
                finishedDistributedTask.Result =
                    problemPluginFacade.JoinSubtaskResults(subtaskResults);
            }
            catch (Exception exception)
            {
                finishedDistributedTask.Status = DistributedTaskStatus.Error;
                finishedDistributedTask.Errors = finishedDistributedTask.Errors.Append(exception.ToString()).ToArray();
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> FinishSubtaskAsync(int id)
        {
            if (!IsSubtaskFullyComputed(id))
                return false;

            var subtasksInProgress = _dbContext.SubtasksInProgress.Where(subtaskInProgress =>
                subtaskInProgress.SubtaskId == id);

            var sampleResult = subtasksInProgress.First().Result;
            if (subtasksInProgress.Any(subtaskInProgress => subtaskInProgress.Result != sampleResult))
            {
                await subtasksInProgress.ForEachAsync(subtaskInProgress =>
                {
                    subtaskInProgress.Errors.Append(
                        "Divergent results detected. Subtask must be computed again.");
                    subtaskInProgress.Status = SubtaskStatus.Error;
                });
            }
            else
            {
                var finishedSubtask = _dbContext.Subtasks.First(subtask => subtask.Id == id);
                finishedSubtask.Result = sampleResult;
                finishedSubtask.Status = SubtaskStatus.Done;
            }

            await _dbContext.SaveChangesAsync();

            return true;
        }

        private bool IsSubtaskFullyComputed(int subtaskId)
        {
            var currentTrustLevel = _dbContext.SubtasksInProgress.Where(subtaskInProgress =>
                    subtaskInProgress.SubtaskId == subtaskId
                    && subtaskInProgress.Status == SubtaskStatus.Done)
                .Sum(subtaskinProgress => subtaskinProgress.Node.TrustLevel);

            var trustLevelToComplete = _dbContext.Subtasks.Where(subtask => subtask.Id == subtaskId)
                .Select(subtask => subtask.DistributedTask.TrustLevelToComplete).First();

            return currentTrustLevel >= trustLevelToComplete;
        }

        private bool IsTaskFullyComputed(int distributedTaskId)
        {
            return _dbContext.Subtasks.Where(subtask => subtask.DistributedTaskId == distributedTaskId)
                .All(subtask => subtask.Status == SubtaskStatus.Done);
        }

        private IProblemPluginFacade GetProblemPluginFacade(Guid definitionGuid, string mainDllName)
        {
            var assemblyPath =
                _pathsProvider.GetCompiledTaskDefinitionMainAssemblyPath(definitionGuid,
                    mainDllName);
            var taskAssembly = _assemblyLoader.LoadAssembly(assemblyPath);

            return _problemPluginFacadeFactory.Create(taskAssembly);
        }
    }
}
