using JsonApiDotNetCore.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Server.Services;

namespace Server.Filters
{
    public class FormatErrorActionFilter : ActionFilterAttribute
    {
        private readonly IJsonApiActionResultFactory _jsonApiActionResultFactory;

        public FormatErrorActionFilter(IJsonApiActionResultFactory jsonApiActionResultFactory)
        {
            _jsonApiActionResultFactory = jsonApiActionResultFactory;
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            switch (context.Result)
            {
                case NotFoundResult result:
                    context.Result = _jsonApiActionResultFactory.Error(new Error(result.StatusCode, "Not found",
                        "The entity cannot be found"));
                    break;

                case UnprocessableEntityResult result:
                    context.Result = _jsonApiActionResultFactory.Error(new Error(result.StatusCode,
                        "Cannot deserialize entity", "The entity cannot be deserialized."));
                    break;

                case BadRequestResult result:
                    context.Result = _jsonApiActionResultFactory.Error(new Error(result.StatusCode,
                        "Request data error", "An unknown error occurred."));
                    break;

                case OkResult _:
                    break;

                case CreatedResult _:
                    break;

                case StatusCodeResult result:
                    context.Result = _jsonApiActionResultFactory.Error(new Error(result.StatusCode, "Unknown error"));
                    break;
            }

            base.OnActionExecuted(context);
        }
    }
}
