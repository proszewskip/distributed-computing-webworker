using System;
using DistributedComputing;

namespace FactorialTask
{
    internal class IntDataFormatter : IDataFormatter<int>
    {
        public byte[] Serialize(int data)
        {
            return BitConverter.GetBytes(data);
        }

        public int Deserialize(byte[] data)
        {
            return BitConverter.ToInt32(data, 0);
        }
    }
}
