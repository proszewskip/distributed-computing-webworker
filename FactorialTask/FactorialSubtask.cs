using DistributedComputing.Common;

namespace DistributedComputing.FactorialTask
{
    public class FactorialSubtask : ISubtask
    {
        public string Perform(string input)
        {
            var x = int.Parse(input);
            var result = Factorial(x);

            return result.ToString();
        }

        private int Factorial(int n)
        {
            if (n < 0) return 0;

            var result = 1;

            for (var i = 1; i <= n; i++) result *= i;

            return result;
        }
    }
}
