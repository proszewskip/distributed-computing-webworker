using System;
using System.Linq;
using System.Reflection;
using DistributedComputing;
using Server.Exceptions;
using Server.Models;

namespace Server.Services
{
    public interface IAssemblyAnalyzer
    {
        ProblemPluginInfo GetProblemPluginInfo(Assembly assembly);

        IProblemPlugin InstantiateProblemPlugin(Assembly assembly);
    }

    public class AssemblyAnalyzer : IAssemblyAnalyzer
    {
        public ProblemPluginInfo GetProblemPluginInfo(Assembly assembly)
        {
            var problemPluginInfo = new ProblemPluginInfo();
            // TODO: test if implementations with provided generic IProblemPlugin parameters will be matched
            // with this type of reflection
            var problemPluginType = GetTypeImplementingInterface<IProblemPlugin>(assembly);

            problemPluginInfo.AssemblyName = assembly.GetName().Name;
            problemPluginInfo.ClassName = problemPluginType.Name;
            problemPluginInfo.Namespace = problemPluginType.Namespace;

            return problemPluginInfo;
        }

        public IProblemPlugin InstantiateProblemPlugin(Assembly assembly)
        {
            var taskClassType = GetTypeImplementingInterface<IProblemPlugin>(assembly);

            try
            {
                return (IProblemPlugin) Activator.CreateInstance(taskClassType);
            }
            catch (Exception exception)
            {
                throw new InvalidAssemblyException($"Cannot create an instance of {taskClassType.Name}", exception);
            }
        }

        private Type GetTypeImplementingInterface<T>(Assembly assembly) where T : class
        {
            var tTypeList = assembly.ExportedTypes.Where(type => type.GetInterface(typeof(T).Name) != null).ToList();

            if (tTypeList.Count == 0)
                throw new InvalidAssemblyException($"The assembly does not contain a class that implements the {typeof(T).Name} interface");
            if (tTypeList.Count > 1)
                throw new InvalidAssemblyException($"The assembly contains multiple classes that implement the {typeof(T).Name} interface");

            return tTypeList.First();
        }
    }
}
