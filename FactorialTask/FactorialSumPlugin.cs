using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DistributedComputing;

namespace FactorialTask
{
    public class FactorialSumPlugin : IProblemPlugin<string, ValueTypeWrapper<int>, ValueTypeWrapper<int>, ValueTypeWrapper<int>>
    {
        private readonly Encoding _encoding = new ASCIIEncoding();

        public string ParseTask(byte[] data)
        {
            return _encoding.GetString(data);
        }

        public byte[] SerializeTaskResult(ValueTypeWrapper<int> taskResult)
        {
            return _encoding.GetBytes(taskResult.ToString());
        }

        public IEnumerable<ValueTypeWrapper<int>> DivideTask(string task)
        {
            return task.Split(',')
                .Select(int.Parse)
                .Select(value => new ValueTypeWrapper<int>(value));
        }

        public ValueTypeWrapper<int> JoinSubtaskResults(IEnumerable<ValueTypeWrapper<int>> subtaskResults)
        {
            return subtaskResults.Sum(result => result.Value);
        }

        public ValueTypeWrapper<int> Compute(ValueTypeWrapper<int> subtask)
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
