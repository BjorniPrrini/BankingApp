using backend.Services.client;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.client;

[ApiController]
[Route("api/client")]
public class ClientHomeController : ControllerBase
{
    private readonly ClientHomeService _service;

    public ClientHomeController(ClientHomeService service)
    {
        _service = service;
    }

    [HttpGet("home/{id}")]
    public async Task<IActionResult> GetClientHome(int id)
    {
        var data =
            await _service.GetClientHome(id);

        if (data == null)
        {
            return NotFound();
        }

        return Ok(data);
    }
}