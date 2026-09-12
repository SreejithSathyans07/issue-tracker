using Microsoft.AspNetCore.Mvc;
using issue_tracker_server.Dtos;
using issue_tracker_server.Services;

namespace issue_tracker_server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpGet("check-username")]
    public async Task<ActionResult<UsernameAvailabilityResponse>> CheckUsername([FromQuery] string username)
    {
        var available = await _authService.IsUsernameAvailableAsync(username);
        return Ok(new UsernameAvailabilityResponse { Available = available });
    }

    [HttpPost("signup")]
    public async Task<ActionResult<UserResponse>> Signup(SignupRequest request)
    {
        var (user, error) = await _authService.SignupAsync(request);

        if (error != null)
        {
            return BadRequest(error);
        }

        return CreatedAtAction(nameof(CheckUsername), new { username = user!.Username }, user);
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var (result, error) = await _authService.LoginAsync(request);

        if (error != null)
        {
            return Unauthorized(error);
        }

        return Ok(result);
    }
}
