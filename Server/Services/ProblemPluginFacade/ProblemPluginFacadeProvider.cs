using System;

namespace Server.Services
{
    public interface IProblemPluginFacadeProvider
    {
        IProblemPluginFacade Provide(Guid taskDefinitionGuid,
            string mainDllName);
    }

    public class ProblemPluginFacadeProvider : IProblemPluginFacadeProvider
    {
        private readonly IPathsProvider _pathsProvider;
        private readonly IAssemblyLoader _assemblyLoader;
        private readonly IProblemPluginFacadeFactory _problemPluginFacadeFactory;

        public ProblemPluginFacadeProvider(
            IPathsProvider pathsProvider,
            IAssemblyLoader assemblyLoader,
            IProblemPluginFacadeFactory problemPluginFacadeFactory
        )
        {
            _pathsProvider = pathsProvider;
            _assemblyLoader = assemblyLoader;
            _problemPluginFacadeFactory = problemPluginFacadeFactory;
        }

        public IProblemPluginFacade Provide(Guid taskDefinitionGuid,
            string mainDllName)
        {
            var assemblyPath =
                _pathsProvider.GetTaskDefinitionMainAssemblyPath(
                    taskDefinitionGuid, mainDllName);

            var taskAssembly = _assemblyLoader.LoadAssembly(assemblyPath);

            return _problemPluginFacadeFactory.Create(taskAssembly);
        }
    }
}
