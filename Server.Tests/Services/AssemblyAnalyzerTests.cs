using System;
using System.Collections.Generic;
using System.Reflection;
using DistributedComputing;
using Moq;
using NUnit.Framework;
using Server.Exceptions;

namespace Server.Services.Tests
{
    public class AssemblyAnalyzerTests
    {
        private readonly AssemblyAnalyzer _assemblyAnalyzer;

        public AssemblyAnalyzerTests()
        {
            _assemblyAnalyzer = new AssemblyAnalyzer();
        }

        [Test]
        public void GetProblemPluginInfo_Returns_CorrectValues()
        {
            var assemblyName = "Test";
            var exportedTypes = new List<Type> { typeof(ExampleProblemPlugin) };
            var assemblyMock = GetAssemblyMock(assemblyName, exportedTypes);

            var problemPluginInfo = _assemblyAnalyzer.GetProblemPluginInfo(assemblyMock.Object);

            Assert.AreEqual(problemPluginInfo.AssemblyName, assemblyName);
            Assert.AreEqual(problemPluginInfo.ClassName, nameof(ExampleProblemPlugin));
            Assert.AreEqual(problemPluginInfo.Namespace, typeof(ExampleProblemPlugin).Namespace);
        }

        [Test]
        public void GetProblemPluginInfo_ThrowsException_When_AssemblyDoesNotImplementProblemInfo()
        {
            var assemblyMock = GetAssemblyMock("Test", new List<Type>());

            Assert.Throws<InvalidAssemblyException>(() => _assemblyAnalyzer.GetProblemPluginInfo(assemblyMock.Object));
        }

        [Test]
        public void GetProblemPluginInfo_ThrowsException_When_AssemblyImplementsTwoProblemInfos()
        {
            var exportedTypes = new List<Type> { typeof(ExampleProblemPlugin), typeof(ExampleProblemPlugin) };
            var assemblyMock = GetAssemblyMock("Test", exportedTypes);

            Assert.Throws<InvalidAssemblyException>(() => _assemblyAnalyzer.GetProblemPluginInfo(assemblyMock.Object));
        }

        private Mock<Assembly> GetAssemblyMock(string assemblyName, List<Type> exportedTypes)
        {
            var assemblyMock = new Mock<Assembly>();

            var assemblyNameObject = new AssemblyName(assemblyName);

            assemblyMock.Setup(e => e.ExportedTypes).Returns(exportedTypes);
            assemblyMock.Setup(e => e.GetName()).Returns(assemblyNameObject);

            return assemblyMock;
        }

        private class ExampleProblemPlugin : IProblemPlugin
        {
            public object ParseTask(byte[] data)
            {
                throw new NotImplementedException();
            }

            public byte[] SerializeTaskResult(object taskResult)
            {
                throw new NotImplementedException();
            }

            public IEnumerable<object> DivideTask(object task)
            {
                throw new NotImplementedException();
            }

            public object JoinSubtaskResults(IEnumerable<object> subtaskResults)
            {
                throw new NotImplementedException();
            }

            public object Compute(object subtask)
            {
                throw new NotImplementedException();
            }
        }
    }
}
