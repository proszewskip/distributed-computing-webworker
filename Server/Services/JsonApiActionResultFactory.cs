using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Internal;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

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

    [SwaggerIgnore]
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
