using backend.Data;
using backend.DTOs.admin;
using backend.Enums;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.admin;

public class AdminAddEmployeeService
{
    private readonly AppDbContext _database;

    public AdminAddEmployeeService(AppDbContext database)
    {
        _database = database;
    }

    public async Task<(bool success, string message, AddEmployeeResponse? data)> AddEmployee(AddEmployeeRequest request)
    {
        bool employeeExists = await _database.Users.AnyAsync(u => u.name == request.name && u.surname == request.surname);

        if (employeeExists)
        {
            return (false, "This employee is already registered", null);
        }

        int employeeID;

        Random random = new Random();

        do
        {
            employeeID = random.Next(100000, 999999);
        } while (await _database.Employees.AnyAsync(e => e.employee_id == employeeID));

        string generatedEmail = request.name.ToLower() + request.surname.ToLower() + employeeID + "@goldstone.com";
        string generatedPassword = request.name.ToLower() + request.surname.ToLower() + employeeID;

        var user = new User
        {
            name = request.name,
            surname = request.surname,
            email = generatedEmail,
            password = BCrypt.Net.BCrypt.HashPassword(generatedPassword),
            role = UserRole.banker
        };
        _database.Users.Add(user);
        await _database.SaveChangesAsync();
        
        var employee = new Employee {
            id = user.id,
            employee_id = employeeID,
            salary = request.salary
        };
        _database.Employees.Add(employee);
        await _database.SaveChangesAsync();
        
        var notification = new Notification {
            userID = user.id,
            type = NotificationType.login_detected,
            message = $"Welcome {request.name} {request.surname}! Your account has been created.",
            isRead = false
        };
        _database.Notifications.Add(notification);
        await _database.SaveChangesAsync();
        
        var autidLog = new AuditLog {
            userID = user.id,
            action = AuditAction.create_user,
            description = $"Employee {request.name} {request.surname} was created by {UserSession.name} {UserSession.surname}.",
        };
        _database.AuditLogs.Add(autidLog);
        await _database.SaveChangesAsync();
        
        return (true, "Employee added successfully", new AddEmployeeResponse {
            employeeID = employeeID,
            email = generatedEmail,
            password = generatedPassword,
        });
    }
}