using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Internal;
using Microsoft.AspNetCore.Mvc;

namespace Server.Services
{
    public interface IJsonApiActionResultFactory
    {
        IActionResult Error(Error error);
        IActionResult Errors(ErrorCollection errors);
    }

    public class JsonApiActionResultFactory : JsonApiControllerMixin, IJsonApiActionResultFactory 
    {
        public new IActionResult Error(Error error)
        {
            return base.Error(error);
        }

        public new IActionResult Errors(ErrorCollection errors)
        {
            return base.Errors(errors);
        }
    }
}
