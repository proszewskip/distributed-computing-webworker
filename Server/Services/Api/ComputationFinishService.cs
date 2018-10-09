using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Models;

namespace Server.Services.Api
{
    public interface IFinishComputationService
    {
        Task CompleteSubtaskInProgressAsync(int subtaskInProgressId, IFormFile subtaskInProgressResult);

        Task FailSubtaskInProgressAsync(int subtaskInProgressId, string[] computationErrors);
    }

    public class FinishComputationService : IFinishComputationService
    {
        private readonly IAssemblyLoader _assemblyLoader;
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IPathsProvider _pathsProvider;
        private readonly IProblemPluginFacadeFactory _problemPluginFacadeFactory;

        public FinishComputationService(
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

        public async Task CompleteSubtaskInProgressAsync(int subtaskInProgressId, IFormFile subtaskInProgressResult)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                var completedSubtaskInProgress = _dbContext.SubtasksInProgress.Include(subtaskInProgress => subtaskInProgress.Subtask).First(subtaskInProgress =>
                    subtaskInProgress.Id == subtaskInProgressId);

                await FinishSubtaskInProgressAsync(subtaskInProgressId, subtaskInProgressResult);

                var isSubtaskFinished = await FinishSubtaskAsync(completedSubtaskInProgress.SubtaskId);

                if (isSubtaskFinished)
                    await FinishTaskAsync(completedSubtaskInProgress.Subtask.DistributedTaskId);

                transaction.Commit();
            }
        }

        public async Task FailSubtaskInProgressAsync(int subtaskInProgressId, string[] computationErrors)
        {
            var failedSubtaskInProgress =
                _dbContext.SubtasksInProgress.Include(subtaskInProgress => subtaskInProgress.Subtask)
                .ThenInclude(subtask => subtask.DistributedTask)
                    .First(subtaskInProgress => subtaskInProgress.Id == subtaskInProgressId);

            failedSubtaskInProgress.Errors = computationErrors;
            failedSubtaskInProgress.Subtask.Status = SubtaskStatus.Error;
            failedSubtaskInProgress.Subtask.DistributedTask.Status = DistributedTaskStatus.Error;

            await _dbContext.SaveChangesAsync();
        }

        private async Task FinishSubtaskInProgressAsync(int id, IFormFile subtaskInProgressResult)
        {
            var finishedSubtaskInProgress =
                _dbContext.SubtasksInProgress.First(subtaskInProgress => subtaskInProgress.Id == id);

            finishedSubtaskInProgress.Status = SubtaskStatus.Done;
            finishedSubtaskInProgress.Result = new byte[subtaskInProgressResult.Length];

            var memoryStream = new MemoryStream(finishedSubtaskInProgress.Result);
            await subtaskInProgressResult.CopyToAsync(memoryStream);

            await _dbContext.SaveChangesAsync();
        }


        private async Task FinishTaskAsync(int id)
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
                .OrderBy(subtask => subtask.SequenceNumber)
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

        private async Task<bool> FinishSubtaskAsync(int id)
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
                .Sum(subtaskInProgress => subtaskInProgress.Node.TrustLevel);

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
