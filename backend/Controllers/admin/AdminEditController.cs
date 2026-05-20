using backend.DTOs.admin;
using backend.Services.admin;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.admin;

[ApiController]
[Route("api/admin/editEmployee")]
public class AdminEditEmployeeController : ControllerBase
{
    private readonly AdminEditEmployeeService _service;
    
    public AdminEditEmployeeController(AdminEditEmployeeService service)
    {
        _service = service;
    }

    [HttpGet("get/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetEmployeeById(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }
    
    [HttpPost("edit")]
    public async Task<IActionResult> EEmployee([FromBody] EditEmployeeResponse response)
    {
        var (success, message, data) = await _service.EditEmployee(response);

        if (!success)
        {
            return BadRequest(new { message });
        }
        
        return Ok(data);
    }
}