using System;
using System.Collections.Generic;
using System.Linq;
using DistributedComputing;
using Server.Exceptions;
using Server.Models;

namespace Server.Services
{
    /// <summary>
    ///     A facade for IProblemPlugin that simplifies interacting with the plugin
    ///     from the server's point of view.
    ///     It also hides away the generic type parameters of IProblemPlugin.
    /// </summary>
    public interface IProblemPluginFacade
    {
        IEnumerable<byte[]> GetSubtasksFromData(byte[] taskData);
        byte[] JoinSubtaskResults(IEnumerable<byte[]> subtaskResults);

        ProblemPluginInfo GetProblemPluginInfo();
    }

    public class ProblemPluginFacade<TTask, TTaskResult, TSubtask, TSubtaskResult> : IProblemPluginFacade
    {
        private readonly IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult> _problemPluginInstance;

        public ProblemPluginFacade(
            IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult> problemPluginInstance
        )
        {
            _problemPluginInstance = problemPluginInstance;
        }

        public IEnumerable<byte[]> GetSubtasksFromData(byte[] taskData)
        {
            var parsedTask = ParseTask(taskData);
            var subtasksData = DivideTask(parsedTask);

            return subtasksData.Select(_problemPluginInstance.SubtaskDataFormatter.Serialize);
        }

        public byte[] JoinSubtaskResults(IEnumerable<byte[]> subtaskResults)
        {
            var subtasksDeserializedData =
                subtaskResults.Select(_problemPluginInstance.SubtaskResultDataFormatter.Deserialize);
            var taskResult = JoinSubtaskResults(subtasksDeserializedData);

            return _problemPluginInstance.TaskResultDataFormatter.Serialize(taskResult);
        }

        public ProblemPluginInfo GetProblemPluginInfo()
        {
            var problemPluginType = _problemPluginInstance.GetType();

            return new ProblemPluginInfo
            {
                AssemblyName = problemPluginType.Assembly.GetName().Name,
                ClassName = problemPluginType.Name,
                Namespace = problemPluginType.Namespace
            };
        }

        private TTask ParseTask(byte[] taskData)
        {
            try
            {
                return _problemPluginInstance.TaskDataFormatter.Deserialize(taskData);
            }
            catch (Exception exception)
            {
                throw new TaskDataParsingException(exception);
            }
        }

        private IEnumerable<TSubtask> DivideTask(TTask task)
        {
            try
            {
                return _problemPluginInstance.DivideTask(task).ToList();
            }
            catch (Exception exception)
            {
                throw new TaskDivisionException(exception);
            }
        }

        private TTaskResult JoinSubtaskResults(IEnumerable<TSubtaskResult> subtaskResults)
        {
            try
            {
                return _problemPluginInstance.JoinSubtaskResults(subtaskResults);
            }
            catch (Exception exception)
            {
                throw new SubtaskResultsJoiningException(exception);
            }
        }
    }
}
