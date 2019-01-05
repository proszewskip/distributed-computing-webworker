using System.Collections.Generic;
using System.Linq;

namespace MaxIsomorphicSubgraphProblem.Problem.Models
{
    public class ProblemResult
    {
        /// <summary>
        ///     A sequence of vertices that induce a subgraph of G that is isomorphic
        ///     with the subgraph induced by vertices in CU.
        /// </summary>
        public List<int> CV { get; set; }

        /// <summary>
        ///     A sequence of vertices that induce a subgraph of H that is isomorphic
        ///     with the subgraph induced by vertices in CV.
        /// </summary>
        public List<int> CU { get; set; }

        public int SubgraphEdges { get; set; }

        public override string ToString()
        {
            var cv = CV.Aggregate(string.Empty, (str, vertice) => $"{str}{vertice},");
            var cu = CU.Aggregate(string.Empty, (str, vertice) => $"{str}{vertice},");

            return $"CV mapping: {cv} CU mapping: {cu} Edges count: {SubgraphEdges}";
        }
    }
}
