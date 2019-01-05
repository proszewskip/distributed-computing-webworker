using MaxIsomorphicSubgraphProblem.Models;

namespace MaxIsomorphicSubgraphProblem.Problem.Comparators
{
    internal interface IProblemResultsComparator
    {
        /// <summary>
        ///     Are results1 better than results2?
        /// </summary>
        /// <param name="results1"></param>
        /// <param name="results2"></param>
        /// <returns></returns>
        bool IsBetter(ProblemResult results1, ProblemResult results2);
    }
}
