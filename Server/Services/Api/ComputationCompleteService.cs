using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using JsonApiDotNetCore.Services;
using Microsoft.EntityFrameworkCore;
using Server.Exceptions;
using Server.Models;

namespace Server.Services.Api
{
    /// <summary>
    /// Service used for synchronizing completing the computation of subtasks.
    /// </summary>
    public interface IComputationCompleteService
    {
        /// <summary>
        /// Marks a given SubtaskInProgress as complete, possibly also marking
        /// the Subtask as complete and DistributedTask as complete.
        ///
        /// Hierarchical marking as complete is done when all the siblings
        /// are also completed.
        /// </summary>
        /// <param name="subtaskInProgressId"></param>
        /// <param name="subtaskInProgressResult"></param>
        /// <returns></returns>
        Task CompleteSubtaskInProgressAsync(int subtaskInProgressId, Stream subtaskInProgressResult);
    }

    public class ComputationCompleteService : IComputationCompleteService
    {
        private readonly IAssemblyLoader _assemblyLoader;
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IPathsProvider _pathsProvider;
        private readonly IProblemPluginFacadeFactory _problemPluginFacadeFactory;
        private readonly IResourceService<SubtaskInProgress> _subtaskInProgressResourceService;
        private readonly IResourceService<Subtask> _subtaskResourceService;

        public ComputationCompleteService(
            DistributedComputingDbContext dbContext,
            IPathsProvider pathsProvider,
            IAssemblyLoader assemblyLoader,
            IResourceService<SubtaskInProgress> subtaskInProgressResourceService,
            IResourceService<Subtask> subtaskResourceService,
            IProblemPluginFacadeFactory problemPluginFacadeFactory)
        {
            _dbContext = dbContext;
            _pathsProvider = pathsProvider;
            _assemblyLoader = assemblyLoader;
            _problemPluginFacadeFactory = problemPluginFacadeFactory;
            _subtaskInProgressResourceService = subtaskInProgressResourceService;
            _subtaskResourceService = subtaskResourceService;
        }

        public async Task CompleteSubtaskInProgressAsync(int subtaskInProgressId, Stream subtaskInProgressResult)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                await FinishSubtaskInProgressAsync(subtaskInProgressId, subtaskInProgressResult);

                transaction.Commit();
            }
        }

        private async Task FinishSubtaskInProgressAsync(int subtaskInProgressId, Stream subtaskInProgressResultStream)
        {
            var subtaskInProgressResult = new byte[subtaskInProgressResultStream.Length];


            var memoryStream = new MemoryStream(subtaskInProgressResult);
            await subtaskInProgressResultStream.CopyToAsync(memoryStream);

            var finishedSubtaskInProgress = await _subtaskInProgressResourceService.GetAsync(subtaskInProgressId);
            finishedSubtaskInProgress.Status = SubtaskStatus.Done;
            finishedSubtaskInProgress.Result = subtaskInProgressResult;

            await _subtaskInProgressResourceService.UpdateAsync(subtaskInProgressId, finishedSubtaskInProgress);

            var isSubtaskFullyComputed = IsSubtaskFullyComputed(finishedSubtaskInProgress.SubtaskId);

            if (isSubtaskFullyComputed)
                await FinishSubtaskAsync(finishedSubtaskInProgress.SubtaskId);
        }

        private async Task FinishSubtaskAsync(int subtaskId)
        {
            var subtasksInProgress = _dbContext.SubtasksInProgress.Where(subtaskInProgress =>
                subtaskInProgress.SubtaskId == subtaskId);

            var sampleResult = subtasksInProgress.First().Result;
            if (subtasksInProgress.Any(subtaskInProgress => subtaskInProgress.Result != sampleResult))
            {
                //TODO: limit number of recomputing
                await subtasksInProgress.ForEachAsync(subtaskInProgress =>
                {
                    subtaskInProgress.Errors = subtaskInProgress.Errors
                        .Append("Divergent results detected. Subtask must be computed again.").ToArray();
                    subtaskInProgress.Status = SubtaskStatus.Error;
                });

                await _dbContext.SaveChangesAsync();
            }
            else
            {
                var finishedSubtask = await _subtaskResourceService.GetAsync(subtaskId);

                finishedSubtask.Result = sampleResult;
                finishedSubtask.Status = SubtaskStatus.Done;

                await _subtaskResourceService.UpdateAsync(subtaskId, finishedSubtask);

                if (IsDistributedTaskFullyComputed(finishedSubtask.DistributedTaskId))
                    await FinishDistributedTaskAsync(finishedSubtask.DistributedTaskId);
            }
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

        private async Task FinishDistributedTaskAsync(int distributedTaskId)
        {
            //TODO: Use IResourceService for updating DistributedTasks.
            var finishedDistributedTask =
                await _dbContext.DistributedTasks.Include(distributedTask => distributedTask.DistributedTaskDefinition)
                    .FirstAsync(distributedTask =>
                        distributedTask.Id == distributedTaskId);

            var problemPluginFacade =
                GetProblemPluginFacade(finishedDistributedTask.DistributedTaskDefinition);

            var subtaskResults = _dbContext.Subtasks
                .Where(subtask => subtask.DistributedTaskId == distributedTaskId)
                .OrderBy(subtask => subtask.SequenceNumber)
                .Select(subtask => subtask.Result);

            try
            {
                finishedDistributedTask.Result =
                    problemPluginFacade.JoinSubtaskResults(subtaskResults);
                finishedDistributedTask.Status = DistributedTaskStatus.Done;
            }
            catch (SubtaskResultsJoiningException exception)
            {
                finishedDistributedTask.Status = DistributedTaskStatus.Error;
                finishedDistributedTask.Errors = finishedDistributedTask.Errors.Append(exception.ToString()).ToArray();
            }

            await _dbContext.SaveChangesAsync();
        }

        private bool IsDistributedTaskFullyComputed(int distributedTaskId)
        {
            return _dbContext.Subtasks.Where(subtask => subtask.DistributedTaskId == distributedTaskId)
                .All(subtask => subtask.Status == SubtaskStatus.Done);
        }

        private IProblemPluginFacade GetProblemPluginFacade(DistributedTaskDefinition distributedTaskDefinition)
        {
            var assemblyPath =
                _pathsProvider.GetTaskDefinitionMainAssemblyPath(distributedTaskDefinition.DefinitionGuid,
                    distributedTaskDefinition.MainDllName);
            var taskAssembly = _assemblyLoader.LoadAssembly(assemblyPath);

            return _problemPluginFacadeFactory.Create(taskAssembly);
        }
    }
}
