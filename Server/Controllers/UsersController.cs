using System.Threading.Tasks;
using JsonApiDotNetCore.Internal;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Server.DTO;
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

        [HttpGet("is-authenticated")]
        public IActionResult IsAuthenticated()
        {
            var isSignedIn = _signInManager.IsSignedIn(User);

            return Ok(new
            {
                isSignedIn
            });
        }
    }
}
