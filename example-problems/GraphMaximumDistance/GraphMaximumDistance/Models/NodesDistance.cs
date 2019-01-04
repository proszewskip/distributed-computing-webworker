using System;

namespace GraphMaximumDistance.Models
{
    public class NodesDistance
    {
        public int InitialNode { get; set; }
        public int FinalNode { get; set; }
        public int Distance { get; set; }

        public override string ToString()
        {
            return $"Initial node: {InitialNode} Final node: {FinalNode} Distance: {Distance}";
        }
    }
}
