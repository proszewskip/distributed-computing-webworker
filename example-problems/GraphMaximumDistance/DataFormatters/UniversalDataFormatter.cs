using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using DistributedComputing;

namespace GraphMaximumDistance.DataFormatters
{
    internal class UniversalDataFormatter<T> : IDataFormatter<T>
    {
        public byte[] Serialize(T obj)
        {
            if (obj == null) return null;

            using (var memoryStream = new MemoryStream())
            {
                var binaryFormatter = new BinaryFormatter();

                binaryFormatter.Serialize(memoryStream, obj);

                return memoryStream.ToArray();
            }
        }


        public T Deserialize(byte[] data)
        {
            using (var memoryStream = new MemoryStream())
            {
                var binaryFormatter = new BinaryFormatter();

                memoryStream.Write(data, 0, data.Length);
                memoryStream.Seek(0, SeekOrigin.Begin);

                return (T) binaryFormatter.Deserialize(memoryStream);
            }
        }
    }
}
