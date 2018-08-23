using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DistributedComputing;

namespace FactorialTask
{
    public class FactorialSumPlugin : IProblemPlugin<string, int, int, int>
    {
        private readonly IntBinarySerializer _intBinarySerializer = new IntBinarySerializer();
        private readonly StringBinarySerializer _stringBinarySerializer = new StringBinarySerializer();

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

        public IBinarySerializer<string> TaskBinarySerializer => _stringBinarySerializer;
        public IBinarySerializer<int> TaskResultBinarySerializer => _intBinarySerializer;
        public IBinarySerializer<int> SubtaskBinarySerializer => _intBinarySerializer;
        public IBinarySerializer<int> SubtaskResultBinarySerializer => _intBinarySerializer;

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
