using System;

namespace Server.Exceptions
{
    public class NullResultException : Exception
    {
        private const string DefaultMessage = "The result is currently not available.";

        public NullResultException() : base(DefaultMessage)
        {
        }

        public NullResultException(Exception innerException) : base(DefaultMessage, innerException)
        {
        }

        public NullResultException(string message) : base(message)
        {
        }

        public NullResultException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
