using System.Text;
using DistributedComputing;

namespace MaxIsomorphicSubgraphProblem.DataFormatters
{
    internal class StringDataFormatter : IDataFormatter<string>
    {
        private readonly Encoding _encoding = new ASCIIEncoding();

        public byte[] Serialize(string data)
        {
            return _encoding.GetBytes(data);
        }

        public string Deserialize(byte[] data)
        {
            return _encoding.GetString(data);
        }
    }
}
