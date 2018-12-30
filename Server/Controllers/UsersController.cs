using System.Collections.Generic;
using System.Threading.Tasks;
using JsonApiDotNetCore.Internal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Server.DTO;
using Server.Filters;
using Server.Services;
using Server.Validation;

namespace Server.Controllers
{
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IJsonApiActionResultFactory _jsonApiActionResultFactory;

        public UsersController(SignInManager<IdentityUser> signInManager, IJsonApiActionResultFactory jsonApiActionResultFactory)
        {
            _signInManager = signInManager;
            _jsonApiActionResultFactory = jsonApiActionResultFactory;
        }

        [ValidateModel]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO body)
        {
            var signInResult = await _signInManager.PasswordSignInAsync(body.Username, body.Password, true, true);

            if (!signInResult.Succeeded)
            {
                return _jsonApiActionResultFactory.Error(new Error(StatusCodes.Status403Forbidden,
                    "Invalid credentials"));
            }

            return Ok();
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            return Ok();
        }

        [ServiceFilter(typeof(AuthorizationFilter))]
        [ValidateModel]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO body)
        {
            var user = await _signInManager.UserManager.GetUserAsync(HttpContext.User);

            var changePasswordResult = await _signInManager.UserManager.ChangePasswordAsync(user,
                body.OldPassword, body.NewPassword);

            if (!changePasswordResult.Succeeded)
            {
                return GetErrorsResult(changePasswordResult.Errors);
            }

            return Ok();
        }

        [HttpGet("is-authenticated")]
        public IActionResult IsAuthenticated()
        {
            var isSignedIn = _signInManager.IsSignedIn(User);

            return Ok(new
            {
                isSignedIn
            });
        }

        private IActionResult GetErrorsResult(IEnumerable<IdentityError> errorsEnumerable)
        {
            var errorsCollection = new ErrorCollection();

            foreach (var error in errorsEnumerable)
            {
                errorsCollection.Add(new Error(StatusCodes.Status400BadRequest, error.Description));
            }

            return _jsonApiActionResultFactory.Errors(errorsCollection);
        }
    }
}
