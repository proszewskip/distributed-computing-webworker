using System;
using System.IO;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;

namespace Server.Services
{
    public interface IDataFormatter<T> where T : class
    {
        T Deserialize(byte[] data);
        byte[] Serialize(T data);
    }

    public class DataFormatter<T> : IDataFormatter<T> where T : class
    {
        private readonly IFormatter _formatter = new BinaryFormatter();

        public T Deserialize(byte[] data)
        {
            using (var stream = new MemoryStream(data))
            {
                stream.Seek(0, SeekOrigin.Begin);
                var deserializedObject = _formatter.Deserialize(stream);

                if (!(deserializedObject is T))
                    throw new SerializationException();

                return (T) deserializedObject;
            }
        }

        public byte[] Serialize(T data)
        {
            using (var stream = new MemoryStream())
            {
                _formatter.Serialize(stream, data);

                return stream.ToArray();
            }
        }
    }
}
