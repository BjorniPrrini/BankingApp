using backend.Data;
using backend.DTOs.admin;
using backend.Models;
using backend.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.admin;

public class AdminHomePage
{
    private readonly AppDbContext _context;

    public AdminHomePage(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EmployeeDto>> GetAllEmployees()
    {
        return await _context.Employees
            .Where(e => e.User.role == UserRole.banker)
            .Select(e => new EmployeeDto
            {
                Id = e.id,
                EmployeeID = e.employee_id,
                Name = e.User.name,
                Surname = e.User.surname,
                PayCheck = e.salary,
                Email = e.User.email
            })
            .ToListAsync();
    }

    public async Task<EmployeeDto?> GetEmployeeById(int id)
    {
        return await _context.Employees
            .Include(e => e.User)
            .Where(e => e.id == id)
            .Select(e => new EmployeeDto
            {
                Id = e.id,
                EmployeeID = e.employee_id,
                Name = e.User.name,
                Surname = e.User.surname,
                PayCheck = e.salary,
                Email = e.User.email
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> DeleteEmployee(int id)
    {
        var employee = await _context.Employees
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.id == id);

        if (employee == null)
            return false;

        var auditLog = new AuditLog {
            userID = UserSession.id,
            action = AuditAction.delete_banker,
            description = $"Employee {employee.User.name} {employee.User.surname} was deleted by {UserSession.name} {UserSession.surname}.",
        };
        _context.AuditLogs.Add(auditLog);

        _context.Employees.Remove(employee);
        _context.Users.Remove(employee.User);

        await _context.SaveChangesAsync();

        return true;
    }
}