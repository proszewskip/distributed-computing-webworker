using System;

namespace Server.Exceptions
{
    public class InvalidEnvironmentConfigurationException : Exception
    {
        public InvalidEnvironmentConfigurationException() : base("Invalid environment configuration")
        {
        }
    }
}
