using System.Collections.Generic;
using System.Linq;
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
            var parsedTask = _problemPluginInstance.ParseTask(taskData);
            var subtasksData = _problemPluginInstance.DivideTask(parsedTask);

            var subtasksDataFormatter = _dataFormatterFactory.Create<TSubtask>();

            return subtasksData.Select(subtasksDataFormatter.Serialize);
        }

        public byte[] JoinSubtaskResults(IEnumerable<byte[]> subtaskResults)
        {
            var subtaskResultsDataFormatter = _dataFormatterFactory.Create<TSubtaskResult>();
            var subtasksDeserializedData = subtaskResults.Select(subtaskResultsDataFormatter.Deserialize);
            var taskResult = _problemPluginInstance.JoinSubtaskResults(subtasksDeserializedData);

            return _problemPluginInstance.SerializeTaskResult(taskResult);
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
    }
}
