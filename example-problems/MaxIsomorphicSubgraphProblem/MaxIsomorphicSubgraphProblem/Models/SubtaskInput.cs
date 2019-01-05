using System;

namespace MaxIsomorphicSubgraphProblem.Models
{
    [Serializable]
    public class SubtaskInput
    {
        public IGraph G { get; set; }
        public IGraph H { get; set; }

        public int V { get; set; }
        public int U { get; set; }
    }
}
