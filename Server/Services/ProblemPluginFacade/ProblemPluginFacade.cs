using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using DistributedComputing;
using Server.Models;

namespace Server.Services
{
    public interface IProblemPluginFacade
    {
        IEnumerable<byte[]> GetSubtasksFromData(byte[] taskData);
        byte[] JoinSubtaskResults(IEnumerable<byte[]> subtaskResults);

        ProblemPluginInfo GetProblemPluginInfo();
    }

    public class ProblemPluginFacade<Task, TaskResult, Subtask, SubtaskResult> : IProblemPluginFacade
    {
        private readonly IDataFormatter<Subtask> _dataFormatter;
        private readonly IProblemPlugin<Task, TaskResult, Subtask, SubtaskResult> _problemPluginInstance;

        public ProblemPluginFacade(IDataFormatter<Subtask> dataFormatter, IProblemPlugin<Task, TaskResult, Subtask, SubtaskResult> problemPluginInstance)
        {
            _dataFormatter = dataFormatter;
            _problemPluginInstance = problemPluginInstance;
        }

        public IEnumerable<byte[]> GetSubtasksFromData(byte[] taskData)
        {
            var parsedTask = _problemPluginInstance.ParseTask(taskData);
            var subtasksData = _problemPluginInstance.DivideTask(parsedTask);

            return subtasksData.Select(_dataFormatter.Serialize);
        }

        public byte[] JoinSubtaskResults(IEnumerable<byte[]> subtaskResults)
        {
            var subtasksDeserializedData = subtaskResults.Select(_dataFormatter.Deserialize);
            var taskResult = _problemPluginInstance.JoinSubtaskResults(subtasksDeserializedData);

            return _problemPluginInstance.SerializeTaskResult(taskResult);
        }

        public ProblemPluginInfo GetProblemPluginInfo()
        {
            throw new NotImplementedException();
        }
    }
}
