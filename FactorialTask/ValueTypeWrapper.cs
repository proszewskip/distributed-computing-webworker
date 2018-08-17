using System.Collections.Generic;

namespace FactorialTask
{
    public class ValueTypeWrapper<T> where T : struct
    {
        // TODO: possibly add ValueTypeWrapper to the library
        public T Value { get; }

        public ValueTypeWrapper(T value)
        {
            Value = value;
        }

        public static implicit operator T(ValueTypeWrapper<T> wrapper)
        {
            return wrapper.Value;
        }

        public static implicit operator ValueTypeWrapper<T>(T value)
        {
            return new ValueTypeWrapper<T>(value);
        }

        public override string ToString()
        {
            return Value.ToString();
        }

        public override bool Equals(object obj)
        {
            switch (obj)
            {
                case T value:
                    return value.Equals(Value);
                case ValueTypeWrapper<T> wrapper:
                    return wrapper.Value.Equals(Value);
            }

            return false;
        }

        public override int GetHashCode()
        {
            return -1937169414 + EqualityComparer<T>.Default.GetHashCode(Value);
        }
    }
}
