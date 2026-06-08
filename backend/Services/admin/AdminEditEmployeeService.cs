using backend.Data;
using backend.DTOs.admin;
using backend.Models;
using backend.Enums;
using backend.Services.notifications;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.admin;

public class AdminEditEmployeeService
{
    private readonly AppDbContext _database;
    private readonly INotificationService _notificationService;

    public AdminEditEmployeeService(AppDbContext database, INotificationService notificationService)
    {
        _database = database;
        _notificationService = notificationService;
    }
    
    public async Task<EditEmployeeResponse?> GetEmployeeById(int id)
    {
        return await _database.Employees
            .Include(e => e.User)
            .Where(e => e.id == id)
            .Select(e => new EditEmployeeResponse
            {
                id = e.User.id,
                employeeID = e.employee_id,
                name = e.User.name,
                surname = e.User.surname,
                salary = e.salary,
                email = e.User.email,
                password = e.User.name.ToLower() + e.User.surname.ToLower() + e.employee_id,
            })
            .FirstOrDefaultAsync();
    }

    public async Task<(bool success, string message, EditEmployeeResponse? data)> EditEmployee(EditEmployeeResponse request)
    {
        var user = await _database.Users.FindAsync(request.id);
        var employee = await _database.Employees.FindAsync(request.id);

        int employeeID = employee.employee_id;
        string generatedEmail = user.email;
        string plainPassword = user.name.ToLower() + user.surname.ToLower() + employeeID;
    
        if (user.name != request.name || user.surname != request.surname) 
        {
            Random random = new Random();
        
            do
            {
                employeeID = random.Next(100000, 999999);
            } while (await _database.Employees.AnyAsync(e => e.employee_id == employeeID && e.id != employee.id));

            generatedEmail = request.name.ToLower() + request.surname.ToLower() + employeeID + "@goldstone.com";
            plainPassword = request.name.ToLower() + request.surname.ToLower() + employeeID;

            user.name = request.name;
            user.surname = request.surname;
            user.email = generatedEmail;
            user.password = BCrypt.Net.BCrypt.HashPassword(plainPassword);
            employee.employee_id = employeeID;
        }

        employee.salary = request.salary;
        
        await _notificationService.SendAsync(user.id, NotificationType.account_updated, $"Your account has been edited by {UserSession.name} {UserSession.surname}!");

        var auditLog = new AuditLog {
            userID = user.id,
            action = AuditAction.update_banker, 
            description = $"Employee {request.name} {request.surname} was edited by {UserSession.name} {UserSession.surname}.",
        };
        _database.AuditLogs.Add(auditLog);

        await _database.SaveChangesAsync();

        return (true, "Employee edited successfully", new EditEmployeeResponse {
            name = user.name,
            surname = user.surname,
            salary = employee.salary,
            employeeID = employeeID,
            email = generatedEmail,
            password = plainPassword,
        });
    }
}