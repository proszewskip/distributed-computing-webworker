namespace DistributedComputing
{
    public interface IBinarySerializer<T>
    {
        byte[] Serialize(T data);

        T Deserialize(byte[] data);
    }
}
