using MaxIsomorphicSubgraphProblem.Models;

namespace MaxIsomorphicSubgraphProblem.Problem.Comparators
{
    internal class VertexCountResultsComparator : IProblemResultsComparator
    {
        public bool IsBetter(ProblemResult results1, ProblemResult results2)
        {
            return results1.CV.Count > results2.CV.Count;
        }
    }
}
