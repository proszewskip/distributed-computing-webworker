using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Moq;
using NUnit.Framework;

namespace Server.Services.Tests
{
    public class PackagerRunnerTests
    {
        private readonly IPackagerRunner _packagerRunner;

        private const string MonoPackagerPath = "path";
        private const string InputDirectory = "input";
        private const string OutputDirectory = "output";

        private string _command;
        private string _commandArgs;

        public PackagerRunnerTests()
        {
            var commandRunnerMock = new Mock<ICommandRunner>();
            commandRunnerMock.Setup(e => e.RunCommandTask(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(5)
                .Callback((string command, string commandArgs) =>
                {
                    _command = command;
                    _commandArgs = commandArgs;
                });

            var pathsProvider = new Mock<IPathsProvider>();
            pathsProvider.Setup(e => e.CompiledTasksDefinitionsDirectoryPath)
                .Returns(OutputDirectory);
            pathsProvider.Setup(e => e.MonoPackagerPath)
                .Returns(MonoPackagerPath);
            pathsProvider.Setup(e => e.TaskDefinitionsDirectoryPath)
                .Returns(InputDirectory);

            _packagerRunner = new PackagerRunner(pathsProvider.Object, commandRunnerMock.Object);
        }

        [Test]
        public async Task PackAssemblyAsync_Should_UseCorrectCommand()
        {
            await _packagerRunner.PackAssemblyAsync("assembly", "b.dll");

            Assert.AreEqual(_command, "mono");
        }

        [Test]
        public async Task PackAssemblyAsync_Should_UseCorrectCommandArguments()
        {
            var assemblyPath = "assembly";
            var assemblyName = "b.dll";
            await _packagerRunner.PackAssemblyAsync(assemblyPath, assemblyName);

            Assert.AreEqual(_commandArgs, string.Join(" ", new List<string>() {
                MonoPackagerPath,
                $"-prefix={Path.Combine(InputDirectory, assemblyPath)}",
                $"-out={Path.Combine(OutputDirectory, assemblyPath)}",
                assemblyName
            }));
        }
    }
}
