using System.Collections.Generic;
using System.Linq;
using DistributedComputing;
using GraphMaximumDistance.DataFormatters;
using GraphMaximumDistance.Models;

namespace GraphMaximumDistance
{
    public class GraphMaximumDistancePlugin : IProblemPlugin<Graph, string, SubtaskInput, NodesDistance>
    {
        private readonly GraphDataFormatter _graphDataFormatter = new GraphDataFormatter();
        private readonly NodesDistanceDataFormatter _nodesDistanceDataFormatter = new NodesDistanceDataFormatter();
        private readonly StringDataFormatter _stringDataFormatter = new StringDataFormatter();
        private readonly SubtaskInputDataFormatter _subtaskInputDataFormatter = new SubtaskInputDataFormatter();


        public IDataFormatter<Graph> TaskDataFormatter => _graphDataFormatter;

        public IDataFormatter<string> TaskResultDataFormatter => _stringDataFormatter;

        public IDataFormatter<SubtaskInput> SubtaskDataFormatter => _subtaskInputDataFormatter;

        public IDataFormatter<NodesDistance> SubtaskResultDataFormatter => _nodesDistanceDataFormatter;

        public NodesDistance Compute(SubtaskInput subtask)
        {
            var result = NodesMaxDistance.GetNodesMaxDistance(subtask.Graph, subtask.InitialNode);

            return result;
        }


        public IEnumerable<SubtaskInput> DivideTask(Graph task)
        {
            return Enumerable.Range(0, task.VerticesCount)
                .Select(index => new SubtaskInput {Graph = task, InitialNode = index});
        }

        public string JoinSubtaskResults(IEnumerable<NodesDistance> subtaskResults)
        {
            return subtaskResults.OrderByDescending(nodesDistance => nodesDistance.Distance).First().ToString();
        }
    }
}
