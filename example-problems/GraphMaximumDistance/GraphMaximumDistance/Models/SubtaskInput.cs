using System;

namespace GraphMaximumDistance.Models
{
    [Serializable]
    public class SubtaskInput
    {
        public Graph Graph { get; set; }

        public int InitialNode { get; set; }
    }
}
