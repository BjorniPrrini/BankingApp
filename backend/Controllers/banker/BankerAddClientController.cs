using backend.DTOs.banker;
using backend.Services.banker;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.banker;

[ApiController]
[Route("api/banker/addClient")]
public class BankerAddClientController : ControllerBase
{
    private readonly BankerAddClientService _service;

    public BankerAddClientController(BankerAddClientService service)
    {
        _service = service;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddClient([FromBody] AddClientRequest request)
    {
        var (success, message, data) = await _service.AddClient(request);

        if (!success)
        {
            return BadRequest(new { message });
        }
        
        return Ok(data);
    }
}