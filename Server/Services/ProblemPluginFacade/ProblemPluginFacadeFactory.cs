using System;
using System.Linq;
using System.Reflection;
using DistributedComputing;
using Server.Exceptions;

namespace Server.Services
{
    public interface IProblemPluginFacadeFactory
    {
        IProblemPluginFacade Create(Assembly assembly);
    }

    public class ProblemPluginFacadeFactory : IProblemPluginFacadeFactory
    {
        private readonly IDataFormatter<object> _dataFormatter;

        public ProblemPluginFacadeFactory(IDataFormatter<object> dataFormatter)
        {
            _dataFormatter = dataFormatter;
        }

        public IProblemPluginFacade Create(Assembly assembly)
        {
            var problemPluginType = GetImplementedProblemPluginType(assembly);

            return new ProblemPluginFacade(_dataFormatter, problemPluginType);
        }

        private Type GetImplementedProblemPluginType(Assembly assembly)
        {
            var problemPluginType = typeof(IProblemPlugin<,,,>);
            var implementedProblemPluginTypes = assembly.ExportedTypes
                .Where(type => type.GetInterface(problemPluginType.Name) != null)
                .ToList();

            if (implementedProblemPluginTypes.Count == 0)
                throw new InvalidAssemblyException($"The assembly does not contain a class that implements the {problemPluginType.Name} interface");
            if (implementedProblemPluginTypes.Count > 1)
                throw new InvalidAssemblyException($"The assembly contains multiple classes that implement the {problemPluginType.Name} interface");

            return implementedProblemPluginTypes.Single();
        }
    }
}
