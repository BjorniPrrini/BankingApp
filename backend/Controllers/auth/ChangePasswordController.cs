using backend.DTOs.auth;
using backend.Services.auth;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.auth;

[ApiController]
[Route("api/changePassword")]
public class ChangePasswordController : ControllerBase
{
    private readonly ChangePasswordService _service;

    public ChangePasswordController(ChangePasswordService service)
    {
        _service = service;
    }
    
    [HttpPost("change")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var (success, message, data) = await _service.ChangePassword(request);

        if (!success)
        {
            return BadRequest(new { message });
        }
        
        return Ok(data);
    }
}