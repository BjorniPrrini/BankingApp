using backend.DTOs.banker;
using backend.Services.banker;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.banker;
[ApiController]
[Route("api/banker/editClient")]
public class BankerEditClientController : ControllerBase
{
    private readonly BankerEditClientService _service;
    
    public BankerEditClientController(BankerEditClientService service)
    {
        _service = service;
    }
    
    [HttpGet("get/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetClientById(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }
    
    [HttpPost("edit")]
    public async Task<IActionResult> Client([FromBody] EditClientResponse response)
    {
        var (success, message, data) = await _service.EditClient(response);

        if (!success)
        {
            return BadRequest(new { message });
        }
        
        return Ok(data);
    }
    
    [HttpPost("balance")]
    public async Task<IActionResult> UpdateBalance([FromBody] UpdateBalanceRequest request)
    {
        var result = await _service.UpdateBalance(request.id, request.balance);

        if (!result)
            return NotFound(new { message = "Client not found" });

        return Ok(new { message = "Balance updated successfully" });
    }
}
    
