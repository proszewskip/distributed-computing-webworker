using System.Linq;
using JsonApiDotNetCore.Internal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Server.Services;

namespace Server.Filters
{
    public class AuthorizationFilter : IAuthorizationFilter
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IJsonApiActionResultFactory _jsonApiActionResultFactory;

        public AuthorizationFilter(SignInManager<IdentityUser> signInManager, IJsonApiActionResultFactory jsonApiActionResultFactory)
        {
            _signInManager = signInManager;
            _jsonApiActionResultFactory = jsonApiActionResultFactory;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (SkipAuthorization(context))
                return;

            if (_signInManager.IsSignedIn(context.HttpContext.User))
                return;

            context.Result = _jsonApiActionResultFactory.Error(
                new Error(StatusCodes.Status403Forbidden, "Not authenticated")
            );
        }

        private bool SkipAuthorization(AuthorizationFilterContext context)
        {
            if (context.ActionDescriptor is ControllerActionDescriptor controllerActionDescriptor)
            {
                var isDefined = controllerActionDescriptor.MethodInfo.GetCustomAttributes(inherit: true)
                    .Any(a => a.GetType() == typeof(AllowAnonymousAttribute));

                return isDefined;
            }

            return false;
        }
    }
}
