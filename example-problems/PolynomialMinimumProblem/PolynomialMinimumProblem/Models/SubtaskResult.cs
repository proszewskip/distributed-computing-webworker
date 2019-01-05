using System;

namespace PolynomialMinimumProblem.Models
{
    [Serializable]
    public class SubtaskResult
    {
        public double Point { get; set; }
        public double Value { get; set; }

        public override string ToString()
        {
            return $"Point: ${Point}; Value: ${Value}";
        }
    }
}
