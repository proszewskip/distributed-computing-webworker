using System.Collections.Generic;
using System.Linq;
using DistributedComputing;
using GraphMaximumDistance.DataFormatters;
using GraphMaximumDistance.Models;

namespace GraphMaximumDistance
{
    public class GraphMaximumDistancePlugin : IProblemPlugin<Graph, string, SubtaskInput, NodesDistance>
    {
        public IDataFormatter<Graph> TaskDataFormatter => new GraphDataFormatter();

        public IDataFormatter<string> TaskResultDataFormatter => new StringDataFormatter();

        public IDataFormatter<SubtaskInput> SubtaskDataFormatter => new UniversalDataFormatter<SubtaskInput>();

        public IDataFormatter<NodesDistance> SubtaskResultDataFormatter =>
            new XmlSerializerDataFormatter<NodesDistance>();

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
