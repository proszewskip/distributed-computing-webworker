using System.Collections.Generic;

namespace DistributedComputing
{
    public interface IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult>
    {
        IEnumerable<TSubtask> DivideTask(TTask task);

        TTaskResult JoinSubtaskResults(IEnumerable<TSubtaskResult> subtaskResults);

        TSubtaskResult Compute(TSubtask subtask);

        IDataFormatter<TTask> GetTaskFormatter();
        IDataFormatter<TTaskResult> GetTaskResultFormatter();
        IDataFormatter<TSubtask> GetSubtaskFormatter();
        IDataFormatter<TSubtaskResult> GetSubtaskResultFormatter();
    }
}
