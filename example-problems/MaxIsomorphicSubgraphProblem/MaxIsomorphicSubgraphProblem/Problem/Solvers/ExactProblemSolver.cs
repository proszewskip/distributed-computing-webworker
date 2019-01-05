using System.Collections.Generic;
using System.Linq;
using MaxIsomorphicSubgraphProblem.Models;
using MaxIsomorphicSubgraphProblem.Problem.Comparators;
using MaxIsomorphicSubgraphProblem.Problem.Models;

namespace MaxIsomorphicSubgraphProblem.Problem.Solvers
{
    /// <summary>
    ///     Assume that
    ///     G = (V, E_G)
    ///     H = (U, E_U)
    ///     Elements of V are called v0, v1, ...
    ///     Elements of U are called u0, u1, ...
    /// </summary>
    internal class ExactProblemSolver : IProblemSolver
    {
        private readonly SubtaskInput _problemInput;
        private readonly IProblemResultsComparator _resultsComparator;

        public ExactProblemSolver(SubtaskInput problemInput, IProblemResultsComparator resultsComparator)
        {
            _problemInput = problemInput;
            _resultsComparator = resultsComparator;
        }

        public ProblemResult Solve()
        {
            var bestProblemResults = new ProblemResult
            {
                CV = new List<int>(),
                CU = new List<int>(),
                SubgraphEdges = 0
            };

            var recursiveSolver =
                new ExactProblemSolverRecursive(_problemInput, _problemInput.V, _problemInput.U, bestProblemResults,
                    _resultsComparator);

            bestProblemResults = recursiveSolver.Solve();

            return bestProblemResults;
        }

        private class ExactProblemSolverRecursive : IProblemSolver
        {
            private readonly bool[] _closedU;

            private readonly bool[] _closedV;

            private readonly ProblemResult _currentProblemResult;
            private readonly List<int> _neighborsU;

            private readonly List<int> _neighborsV;
            private readonly SubtaskInput _problemInput;
            private readonly IProblemResultsComparator _resultsComparator;


            public ExactProblemSolverRecursive(
                SubtaskInput problemInput,
                int initialV,
                int initialU,
                ProblemResult bestProblemResult,
                IProblemResultsComparator resultsComparator
            )
            {
                _problemInput = problemInput;
                _resultsComparator = resultsComparator;
                BestProblemResult = bestProblemResult;

                var n = _problemInput.G.VerticesCount;
                var m = _problemInput.H.VerticesCount;

                _currentProblemResult = new ProblemResult
                {
                    CV = new List<int>(n),
                    CU = new List<int>(m),
                    SubgraphEdges = 0
                };

                _neighborsV = new List<int>(n) {initialV};
                _neighborsU = new List<int>(m) {initialU};

                _closedV = new bool[n];
                _closedV[initialV] = true;

                _closedU = new bool[m];
                _closedU[initialU] = true;
            }

            private IGraph G => _problemInput.G;
            private IGraph H => _problemInput.H;

            private ProblemResult BestProblemResult { get; set; }

            private List<int> CV => _currentProblemResult.CV;
            private List<int> CU => _currentProblemResult.CU;

            public ProblemResult Solve()
            {
                SolveRecursively();

                return BestProblemResult;
            }

            private void SolveRecursively()
            {
                if (IsCurrentMappingBetterThanCurrentlyBest())
                    BestProblemResult = new ProblemResult
                    {
                        CV = new List<int>(CV),
                        CU = new List<int>(CU),
                        SubgraphEdges = _currentProblemResult.SubgraphEdges
                    };

                // Use for because the collection is modified during enumeration
                // which results in an exception when using foreach
                for (var i = 0; i < _neighborsV.Count; i++)
                {
                    var v = _neighborsV[i];

                    for (var j = 0; j < _neighborsU.Count; j++)
                    {
                        var u = _neighborsU[j];

                        var (maintainsIsomorphism, edgesAddedAfterExpansion) = CanExpandAndMaintainIsomorphism(v, u);
                        if (!maintainsIsomorphism)
                            continue;

                        // Expand cV and cU by v and u
                        _neighborsV.Remove(v);
                        _neighborsU.Remove(u);

                        CV.Add(v);
                        CU.Add(u);

                        var newNeighborsInG = G.GetNeighbors(v)
                            .Where(x => !_closedV[x])
                            .ToList();
                        var newNeighborsInH = H.GetNeighbors(u)
                            .Where(x => !_closedU[x])
                            .ToList();

                        foreach (var x in newNeighborsInG)
                        {
                            _closedV[x] = true;
                            _neighborsV.Add(x);
                        }

                        foreach (var x in newNeighborsInH)
                        {
                            _closedU[x] = true;
                            _neighborsU.Add(x);
                        }

                        _currentProblemResult.SubgraphEdges += edgesAddedAfterExpansion;

                        // Solve recursively
                        SolveRecursively();

                        // Revert expansion
                        _neighborsV.Add(v);
                        _neighborsU.Add(u);

                        CV.RemoveAt(CV.Count - 1);
                        CU.RemoveAt(CU.Count - 1);

                        foreach (var x in newNeighborsInG)
                        {
                            _closedV[x] = false;
                            _neighborsV.Remove(x);
                        }

                        foreach (var x in newNeighborsInH)
                        {
                            _closedU[x] = false;
                            _neighborsU.Remove(x);
                        }

                        _currentProblemResult.SubgraphEdges -= edgesAddedAfterExpansion;
                    }
                }
            }

            private bool IsCurrentMappingBetterThanCurrentlyBest()
            {
                return _resultsComparator.IsBetter(_currentProblemResult, BestProblemResult);
            }

            private (bool, int) CanExpandAndMaintainIsomorphism(int v, int u)
            {
                var edgesAddedAfterExpansion = 0;

                for (var i = 0; i < CV.Count; i++)
                {
                    var hasEdgeInG = G.HasEdge(CV[i], v);
                    var hasEdgeInH = H.HasEdge(CU[i], u);

                    if (hasEdgeInG != hasEdgeInH)
                        return (false, 0);

                    if (hasEdgeInG)
                        edgesAddedAfterExpansion++;
                }

                return (true, edgesAddedAfterExpansion);
            }
        }
    }
}
