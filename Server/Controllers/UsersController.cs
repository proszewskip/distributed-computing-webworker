using System.Collections.Generic;
using System.Threading.Tasks;
using JsonApiDotNetCore.Internal;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Server.DTO;
using Server.Services;

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

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO body)
        {
            var user = await _signInManager.UserManager.FindByNameAsync(body.Username);

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
            var errorsList = new List<IdentityError>(errorsEnumerable);

            var errorsCollection = new ErrorCollection();

            errorsList.ForEach(error => errorsCollection.Add(new Error(StatusCodes.Status400BadRequest, error.Description)));

            return _jsonApiActionResultFactory.Errors(errorsCollection);
        }
    }
}
