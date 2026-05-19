
using backend.DTOs.admin;
using backend.Services.admin;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.admin;

[ApiController]
[Route("api/admin/addEmployee")]
public class AdminAddEmployeeController : ControllerBase
{
    private readonly AdminAddEmployeeService _service;

    public AdminAddEmployeeController(AdminAddEmployeeService service)
    {
        _service = service;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddEmployee([FromBody] AddEmployeeRequest request)
    {
        var (success, message, data) = await _service.AddEmployee(request);

        if (!success)
        {
            return BadRequest(new { message });
        }
        
        return Ok(data);
    }
}