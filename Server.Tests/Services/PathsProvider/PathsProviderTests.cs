using System;
using System.IO;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using NUnit.Framework;
using Server.Exceptions;
using Server.Models;
using Server.Services;

namespace Server.Tests.Services
{
    public class PathsProviderTests
    {
        [Test]
        public void InitializePaths_Should_Throw_On_Invalid_Paths()
        {
            var logger = new Mock<ILogger<PathsProvider>>();
            var serverConfig = Options.Create(new ServerConfig
                {CompiledTaskDefinitionsDirectoryPath = "test", TaskDefinitionsDirectoryPath = "testt"});

            Assert.Throws<InvalidEnvironmentConfigurationException>(
                () => new PathsProvider(logger.Object, serverConfig));
        }

        [Test]
        public void GetCompiledTaskDefinitionWebPath_ShouldReturnCorrectPath()
        {
            var logger = new Mock<ILogger<PathsProvider>>();

            var currentDirectory = Path.GetFileName(Directory.GetCurrentDirectory());
            currentDirectory = "../" + currentDirectory;


            var serverConfig = Options.Create(new ServerConfig
            {
                CompiledTaskDefinitionsDirectoryPath = currentDirectory,
                TaskDefinitionsDirectoryPath = currentDirectory
            });

            var pathsProvider = new PathsProvider(logger.Object, serverConfig);

            var guid = Guid.NewGuid();

            Assert.AreEqual($"/public/task-definitions/{guid}", pathsProvider.GetCompiledTaskDefinitionWebPath(guid));
        }


        [Test]
        public void GetTaskDefinitionMainAssemblyPath_ShouldReturnCorrectPath()
        {
            var logger = new Mock<ILogger<PathsProvider>>();

            var currentDirectory = Path.GetFileName(Directory.GetCurrentDirectory());
            currentDirectory = "../" + currentDirectory;


            var serverConfig = Options.Create(new ServerConfig
            {
                CompiledTaskDefinitionsDirectoryPath = currentDirectory,
                TaskDefinitionsDirectoryPath = currentDirectory
            });

            var pathsProvider = new PathsProvider(logger.Object, serverConfig);

            var guid = Guid.NewGuid();

            var expectedPath = Path.GetFullPath($"{Directory.GetCurrentDirectory()}/{guid}/test");

            Assert.AreEqual(expectedPath, pathsProvider.GetTaskDefinitionMainAssemblyPath(guid, "test"));
        }

        [Test]
        public void GetCompiledTaskDefinitionDirectoryPath_ShouldReturnCorrectPath()
        {
            var logger = new Mock<ILogger<PathsProvider>>();

            var currentDirectory = Path.GetFileName(Directory.GetCurrentDirectory());
            currentDirectory = "../" + currentDirectory;


            var serverConfig = Options.Create(new ServerConfig
            {
                CompiledTaskDefinitionsDirectoryPath = currentDirectory,
                TaskDefinitionsDirectoryPath = currentDirectory
            });

            var pathsProvider = new PathsProvider(logger.Object, serverConfig);

            var guid = Guid.NewGuid();

            var expectedPath = Path.GetFullPath($"{Directory.GetCurrentDirectory()}/{guid}");

            Assert.AreEqual(expectedPath, pathsProvider.GetCompiledTaskDefinitionDirectoryPath(guid));
        }


        [Test]
        public void GetTaskDefinitionDirectoryPath_ShouldReturnCorrectPath()
        {
            var logger = new Mock<ILogger<PathsProvider>>();

            var currentDirectory = Path.GetFileName(Directory.GetCurrentDirectory());
            currentDirectory = "../" + currentDirectory;


            var serverConfig = Options.Create(new ServerConfig
            {
                CompiledTaskDefinitionsDirectoryPath = currentDirectory,
                TaskDefinitionsDirectoryPath = currentDirectory
            });

            var pathsProvider = new PathsProvider(logger.Object, serverConfig);

            var guid = Guid.NewGuid();

            var expectedPath = Path.GetFullPath($"{Directory.GetCurrentDirectory()}/{guid}");

            Assert.AreEqual(expectedPath, pathsProvider.GetTaskDefinitionDirectoryPath(guid));
        }
    }
}
