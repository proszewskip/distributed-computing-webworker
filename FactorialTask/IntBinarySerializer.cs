using System;
using DistributedComputing;

namespace FactorialTask
{
    class IntBinarySerializer : IBinarySerializer<int>
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
