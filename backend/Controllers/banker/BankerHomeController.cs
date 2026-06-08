using backend.Services.banker;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.banker;

[ApiController]
[Route("api/banker/home/client")]
public class BankerHomeClientController : ControllerBase
{
    private readonly BankerHomePage _service;

    public BankerHomeClientController(BankerHomePage service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetClients()
    {
        var result = await _service.GetAllClients();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetClientById(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteClient(id);

        if (!result)
            return NotFound();

        return Ok();
    }
}