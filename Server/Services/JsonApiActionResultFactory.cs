using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Internal;
using Microsoft.AspNetCore.Mvc;

namespace Server.Services
{
    /// <summary>
    /// Exposes internal JSON API action results for returning errors.
    /// </summary>
    public interface IJsonApiActionResultFactory
    {
        IActionResult Error(Error error);
        IActionResult Errors(ErrorCollection errorsCollection);
    }

    public class JsonApiActionResultFactory : JsonApiControllerMixin, IJsonApiActionResultFactory 
    {
        public new IActionResult Error(Error error)
        {
            return base.Error(error);
        }

        public new IActionResult Errors(ErrorCollection errorsCollection)
        {
            return base.Errors(errorsCollection);
        }
    }
}
