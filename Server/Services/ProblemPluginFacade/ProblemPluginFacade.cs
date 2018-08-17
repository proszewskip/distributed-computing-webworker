using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Server.Models;

namespace Server.Services
{
    public interface IProblemPluginFacade
    {
        IEnumerable<byte[]> GetSubtasksFromData(byte[] taskData);
        byte[] JoinSubtaskResults(IEnumerable<byte[]> subtaskResults);

        ProblemPluginInfo GetProblemPluginInfo();
    }

    public class ProblemPluginFacade : IProblemPluginFacade
    {
        private readonly IDataFormatter<object> _dataFormatter;
        private readonly Type _problemPluginType;

        public ProblemPluginFacade(IDataFormatter<object> dataFormatter, Type problemPluginType)
        {
            _dataFormatter = dataFormatter;
            _problemPluginType = problemPluginType;
        }

        public IEnumerable<byte[]> GetSubtasksFromData(byte[] taskData)
        {
            var instance = GetProblemPluginInstance();

            var parsedTask = GetProblemPluginMethod("ParseTask").Invoke(instance, new[] { taskData });
            var subtasksData = (IEnumerable<object>)GetProblemPluginMethod("DivideTask").Invoke(instance, new[] { parsedTask });

            return subtasksData.Select(_dataFormatter.Serialize);
        }

        public byte[] JoinSubtaskResults(IEnumerable<byte[]> subtaskResults)
        {
            var instance = GetProblemPluginInstance();

            var subtasksDeserializedData = subtaskResults.Select(_dataFormatter.Deserialize);
            var taskResult = GetProblemPluginMethod("JoinSubtaskResults")
                .Invoke(instance, new[] { subtasksDeserializedData });

            return (byte[])GetProblemPluginMethod("SerializeTaskResult").Invoke(instance, new[] { taskResult });
        }

        public ProblemPluginInfo GetProblemPluginInfo()
        {
            return new ProblemPluginInfo
            {
                AssemblyName = _problemPluginType.Assembly.GetName().Name,
                ClassName = _problemPluginType.Name,
                Namespace = _problemPluginType.Namespace,
            };
        }

        private object GetProblemPluginInstance()
        {
            return Activator.CreateInstance(_problemPluginType);
        }

        private MethodInfo GetProblemPluginMethod(string name)
        {
            return _problemPluginType.GetMethod(name);
        }
    }
}
