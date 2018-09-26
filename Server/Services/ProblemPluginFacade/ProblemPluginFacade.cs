using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using DistributedComputing;
using Server.Exceptions;
using Server.Models;

namespace Server.Services
{
    public interface IProblemPluginFacade
    {
        IEnumerable<byte[]> GetSubtasksFromData(byte[] taskData);
        byte[] JoinSubtaskResults(IEnumerable<byte[]> subtaskResults);

        ProblemPluginInfo GetProblemPluginInfo();
    }

    public class ProblemPluginFacade<TTask, TTaskResult, TSubtask, TSubtaskResult> : IProblemPluginFacade
    {
        private readonly IDataFormatterFactory _dataFormatterFactory;
        private readonly IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult> _problemPluginInstance;

        public ProblemPluginFacade(
            IDataFormatterFactory dataFormatterFactory,
            IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult> problemPluginInstance
        )
        {
            _dataFormatterFactory = dataFormatterFactory;
            _problemPluginInstance = problemPluginInstance;
        }

        public IEnumerable<byte[]> GetSubtasksFromData(byte[] taskData)
        {
            var parsedTask = ParseTask(taskData);
            var subtasksData = DivideTask(parsedTask);

            var subtasksDataFormatter = _dataFormatterFactory.Create<TSubtask>();

            return subtasksData.Select(subtasksDataFormatter.Serialize);
        }

        public byte[] JoinSubtaskResults(IEnumerable<byte[]> subtaskResults)
        {
            var subtaskResultsDataFormatter = _dataFormatterFactory.Create<TSubtaskResult>();
            var subtasksDeserializedData = subtaskResults.Select(subtaskResultsDataFormatter.Deserialize);
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
                Namespace = problemPluginType.Namespace,
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
