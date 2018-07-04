using System.Linq;
using DistributedComputing.Common;

namespace DistributedComputing.FactorialTask
{
    public class FactorialTask : ITask
    {
        public void DefineTasks(string input, ISubtaskFactory subtaskFactory)
        {
            var numbers = input.Split(',');

            foreach (var number in numbers) subtaskFactory.CreateNewSubtask(number);
        }

        public string AggregateResults(string input, string[] results)
        {
            return results.Select(int.Parse).Sum().ToString();
        }
    }
}