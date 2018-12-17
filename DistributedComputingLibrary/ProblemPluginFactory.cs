using System;
using System.Reflection;
using System.Xml.XPath;

namespace DistributedComputing
{
    /// <summary>
    ///     Static factory used for instantiating a class that implements IProblemPlugin.
    /// 
    ///     This class is required to create an instance of IProblemPlugin in the browser
    ///     of distributed nodes in WebAssembly.
    /// </summary>
    public static class ProblemPluginFactory
    {
        public static byte[] ComputeTask<TTask, TTaskResult, TSubtask, TSubtaskResult>(string assemblyName,
            string className, byte[] taskData)
        {
            //TODO: use correct types
            var instance =
                CreateProblemPlugin<string, string, int, int>(assemblyName,
                    className);

            var serializedInputData = instance.SubtaskDataFormatter.Deserialize(taskData);

            Console.WriteLine(serializedInputData);

            var result = instance.Compute(serializedInputData);

            Console.WriteLine(result);

            var serializedResult = instance.SubtaskResultDataFormatter.Serialize(result);

            return serializedResult;
        }

        private static IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult> CreateProblemPlugin<TTask,
            TTaskResult, TSubtask, TSubtaskResult>(string assemblyName, string className)
        {
            var assembly = Assembly.Load(assemblyName);

            var classType = assembly.GetType(className);
            var problemPluginInterfaceName = (typeof(IProblemPlugin<,,,>)).Name;


            var problemPluginInterface = classType.GetInterface(problemPluginInterfaceName);

            if (problemPluginInterface == null)
                throw new ArgumentException(
                    $"Class {className} does not implement the {problemPluginInterfaceName} interface");

            var pluginInstance = Activator.CreateInstance(classType);

            return (IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult>)pluginInstance;
        }
    }
}
