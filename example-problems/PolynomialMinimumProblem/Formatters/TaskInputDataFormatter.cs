using System;
using System.Linq;
using DistributedComputing;

namespace PolynomialMinimumProblem.Formatters
{
    internal class TaskInputDataFormatter : IDataFormatter<TaskInput>
    {
        private readonly StringDataFormatter _stringDataFormatter = new StringDataFormatter();

        public TaskInput Deserialize(byte[] data)
        {
            var stringInput = _stringDataFormatter.Deserialize(data);
            var taskInputArguments = stringInput.Split(';');

            var coefficients = taskInputArguments[3].Split(' ').Select(number => double.Parse(number)).ToArray();


            return new TaskInput
            {
                LowerBound = double.Parse(taskInputArguments[0]),
                UpperBound = double.Parse(taskInputArguments[1]),
                SubtasksCount = int.Parse(taskInputArguments[2]),
                Coefficients = coefficients
            };
        }

        public byte[] Serialize(TaskInput data)
        {
            throw new NotImplementedException();
        }
    }
}
