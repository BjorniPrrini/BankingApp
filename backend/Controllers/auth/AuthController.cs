using backend.DTOs.auth;
using backend.Services.auth;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.auth;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _service;

    public AuthController(AuthService service)
    {
        _service = service;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var (success, message, data) =
            await _service.Login(request);

        if (!success)
        {
            return BadRequest(new
            {
                message
            });
        }

        return Ok(data);
    }
}