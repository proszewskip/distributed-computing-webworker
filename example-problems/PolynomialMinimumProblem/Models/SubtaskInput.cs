using System;

namespace PolynomialMinimumProblem
{
    [Serializable]
    public class SubtaskInput
    {
        public double LowerBound { get; set; }
        public double UpperBound { get; set; }
        public double[] Coefficients { get; set; }
    }
}
