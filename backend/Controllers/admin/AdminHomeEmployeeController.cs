using backend.Services.admin;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.admin;

[ApiController]
[Route("api/admin/home/employee")]
public class AdminHomeEmployeeController : ControllerBase
{
    private readonly AdminHomePage _service;

    public AdminHomeEmployeeController(AdminHomePage service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetEmployees()
    {
        var result = await _service.GetAllEmployees();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetEmployeeById(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteEmployee(id);

        if (!result)
            return NotFound();

        return Ok();
    }
}