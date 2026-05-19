using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.email == request.Email);

        if (user == null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid credentials"
            });
        }

        bool validPassword =
            BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.password
            );

        if (!validPassword)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid credentials"
            });
        }

        return Ok(new
        {
            success = true,
            role = user.role.ToString().ToLower(),
            email = user.email,
            name = user.name
        });
    }
}

public class LoginRequest
{
    public string Email { get; set; }

    public string Password { get; set; }
}