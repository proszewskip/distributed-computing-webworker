using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DistributedComputing;

namespace FactorialTask
{
    public class FactorialSumPlugin : IProblemPlugin<string, int, int, int>
    {
        private readonly Encoding _encoding = new ASCIIEncoding();

        public string ParseTask(byte[] data)
        {
            return _encoding.GetString(data);
        }

        public byte[] SerializeTaskResult(int taskResult)
        {
            return _encoding.GetBytes(taskResult.ToString());
        }

        public IEnumerable<int> DivideTask(string task)
        {
            return task.Split(',')
                .Select(int.Parse)
                .ToList();
        }

        public int JoinSubtaskResults(IEnumerable<int> subtaskResults)
        {
            return subtaskResults.Sum();
        }

        public int Compute(int subtask)
        {
            return Factorial(subtask);
        }

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
