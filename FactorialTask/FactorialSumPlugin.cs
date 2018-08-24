using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DistributedComputing;

namespace FactorialTask
{
    public class FactorialSumPlugin : IProblemPlugin<string, int, int, int>
    {
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

        public IDataFormatter<string> GetTaskFormatter() => new StringDataFormatter();
        public IDataFormatter<int> GetTaskResultFormatter() => new IntDataFormatter();
        public IDataFormatter<int> GetSubtaskFormatter() => new IntDataFormatter();
        public IDataFormatter<int> GetSubtaskResultFormatter() => new IntDataFormatter();

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
