using JsonApiDotNetCore.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Server.Validation
{
    /// <summary>
    /// Attribute that enforces model validation before the controller
    /// action is executed.
    /// </summary>
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var modelState = context.ModelState;
            if (modelState.IsValid)
                return;

            var errorCollection = modelState.ConvertToErrorCollection();
            var result = new ObjectResult(errorCollection)
            {
                StatusCode = StatusCodes.Status400BadRequest
            };

            context.Result = result;
        }
    }
}
