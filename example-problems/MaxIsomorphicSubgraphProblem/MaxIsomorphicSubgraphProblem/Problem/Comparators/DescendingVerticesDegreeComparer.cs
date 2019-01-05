using System;
using System.Collections.Generic;

namespace MaxIsomorphicSubgraphProblem.Problem.Comparators
{
    internal class DescendingVerticesDegreeComparer<T> : IComparer<int> where T : IComparable
    {
        private readonly T[] _compareByArray;

        public DescendingVerticesDegreeComparer(T[] compareByArray)
        {
            _compareByArray = compareByArray;
        }

        public int Compare(int x, int y)
        {
            var result = _compareByArray[y].CompareTo(_compareByArray[x]);

            if (result == 0) return x.CompareTo(y);

            return result;
        }
    }
}
