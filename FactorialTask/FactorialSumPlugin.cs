using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DistributedComputing;

namespace FactorialTask
{
    public class FactorialSumPlugin : IProblemPlugin<string, int, int, int>
    {
        private readonly IntDataFormatter _intDataFormatter = new IntDataFormatter();
        private readonly StringDataFormatter _stringDataFormatter = new StringDataFormatter();

        public IEnumerable<int> DivideTask(string task)
        {
            return task.Split(',')
                .Select(int.Parse);
        }

        public int JoinSubtaskResults(IEnumerable<int> subtaskResults)
        {
            return subtaskResults.Sum();
        }

        public int Compute(int subtask)
        {
            return Factorial(subtask);
        }

        public IDataFormatter<string> TaskDataFormatter => _stringDataFormatter;
        public IDataFormatter<int> TaskResultDataFormatter => _intDataFormatter;
        public IDataFormatter<int> SubtaskDataFormatter => _intDataFormatter;
        public IDataFormatter<int> SubtaskResultDataFormatter => _intDataFormatter;

        private int Factorial(int x)
        {
            if (x < 0)
                throw new ArithmeticException("Cannot compute a factorial for a negative number");

            var result = 1;

            while (x > 1)
            {
                result *= x;
                x--;
            }

            return result;
        }
    }
}
