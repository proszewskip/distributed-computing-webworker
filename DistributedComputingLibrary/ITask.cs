namespace DistributedComputing.Common
{
    public interface ITask
    {
        string AggregateResults(string input, string[] results);
        void DefineTasks(string input, ISubtaskFactory subtaskFactory);
    }
}
