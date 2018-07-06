using System;
using System.Linq;
using System.Reflection;
using DistributedComputing.Common;
using Server.Models;

namespace Server.Services.AssemblyAnalyzer
{
    public class AssemblyAnalyzer : IAssemblyAnalyzer
    {
        public SubtaskInfo GetSubtaskInfo(Assembly assembly)
        {
            var subtaskInfo = new SubtaskInfo();

            var subtaskType = GetTypeImplementingInterface<ISubtask>(assembly);

            subtaskInfo.AssemblyName = GetAssemblyTitle(assembly);
            subtaskInfo.ClassName = subtaskType.Name;
            subtaskInfo.Namespace = subtaskType.Namespace;


            return subtaskInfo;
        }

        public Type GetTypeImplementingInterface<T>(Assembly assembly) where T : class
        {
            var tTypeList = assembly.ExportedTypes.Where(type => type.GetInterface(typeof(T).Name) != null).ToList();

            if (tTypeList.Count == 0)
                throw new Exception("The assembly does not contain a class that implements the " + typeof(T).Name +
                                    " interface");
            if (tTypeList.Count != 1)
                throw new Exception("The assembly contains multiple classes that implement the " + typeof(T).Name +
                                    " interface");

            return tTypeList.First();
        }

        private string GetAssemblyTitle(Assembly assembly)
        {
            var assemblyTitle = assembly.GetCustomAttribute<AssemblyTitleAttribute>();
            if (assemblyTitle == null) throw new Exception("The assembly does not contain the title attribute.");

            return assemblyTitle.Title;
        }
    }
}
