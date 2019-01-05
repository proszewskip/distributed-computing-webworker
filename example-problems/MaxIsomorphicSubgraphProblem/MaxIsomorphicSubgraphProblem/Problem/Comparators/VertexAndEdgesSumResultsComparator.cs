using MaxIsomorphicSubgraphProblem.Problem.Models;

namespace MaxIsomorphicSubgraphProblem.Problem.Comparators
{
    internal class VertexAndEdgesSumResultsComparator : IProblemResultsComparator
    {
        public bool IsBetter(ProblemResult results1, ProblemResult results2)
        {
            var metric1 = results1.CV.Count + results1.SubgraphEdges;
            var metric2 = results2.CV.Count + results2.SubgraphEdges;

            return metric1 > metric2;
        }
    }
}
