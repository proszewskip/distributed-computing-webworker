using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Moq;
using NUnit.Framework;
using Server.Services;
using Server.Services.CommandRunner;

namespace Server.Tests.Services
{
    public class PackagerRunnerTests
    {
        private readonly PackagerRunner _packagerRunner;

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

            _packagerRunner = new PackagerRunner(
                MonoPackagerPath,
                InputDirectory,
                OutputDirectory,
                commandRunnerMock.Object
            );
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
                $"-prefix={Path.Join(InputDirectory, assemblyPath)}",
                $"-out={Path.Join(OutputDirectory, assemblyPath)}",
                assemblyName
            }));
        }
    }
}
