using backend.DTOs.client;
using backend.Services.client;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.client;

[ApiController]
[Route("api/client")]
public class ClientTransferController : ControllerBase
{
    private readonly ClientTransferService _service;

    public ClientTransferController(ClientTransferService service)
    {
        _service = service;
    }

    [HttpPost("transfer")]
    public async Task<IActionResult> Transfer([FromBody] TransferRequest request)
    {
        var (success, message, data) = await _service.Transfer(request);

        if (!success)
            return BadRequest(new { message });

        return Ok(data);
    }

    [HttpGet("transactions/{userId}")]
    public async Task<IActionResult> GetTransactions(int userId)
    {
        var transactions = await _service.GetTransactions(userId);
        return Ok(transactions);
    }
}