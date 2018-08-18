using System;

namespace Server.Exceptions
{
    public class SubtaskResultsJoiningException : Exception
    {
        private const string DefaultMessage = "Cannot join subtask results";

        public SubtaskResultsJoiningException() : base(DefaultMessage)
        {
        }

        public SubtaskResultsJoiningException(Exception innerException) : base(DefaultMessage, innerException)
        {
        }

        public SubtaskResultsJoiningException(string message) : base(message)
        {
        }

        public SubtaskResultsJoiningException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
