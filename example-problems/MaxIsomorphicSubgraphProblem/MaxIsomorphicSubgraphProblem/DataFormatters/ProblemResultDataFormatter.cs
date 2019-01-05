using DistributedComputing;
using MaxIsomorphicSubgraphProblem.Problem.Models;

namespace MaxIsomorphicSubgraphProblem.DataFormatters
{
    internal class ProblemResultDataFormatter : IDataFormatter<ProblemResult>
    {
        private readonly XmlSerializerDataFormatter<ProblemResult> _xmlSerializerDataFormatter =
            new XmlSerializerDataFormatter<ProblemResult>();

        public ProblemResult Deserialize(byte[] data)
        {
            return _xmlSerializerDataFormatter.Deserialize(data);
        }

        public byte[] Serialize(ProblemResult data)
        {
            return _xmlSerializerDataFormatter.Serialize(data);
        }
    }
}
