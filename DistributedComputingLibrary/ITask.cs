namespace DistributedComputing.Common
{
    public interface ITask
    {
        void DefineTasks(string input, ISubtaskFactory subtaskFactory);

        string AggregateResults(string input, string[] results);
    }
}