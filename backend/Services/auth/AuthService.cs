using backend.Data;
using backend.DTOs.auth;
using backend.Enums;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.auth;

public class AuthService
{
    private readonly AppDbContext _database;

    public AuthService(AppDbContext database)
    {
        _database = database;
    }

    public async Task<(bool success, string message, LoginResponse? data)> Login(LoginRequest request)
    {
        var user = await _database.Users
            .FirstOrDefaultAsync(u => u.email == request.Email);

        if (user == null)
        {
            return (false, "Invalid email or password", null);
        }

        bool passwordCorrect =
            BCrypt.Net.BCrypt.Verify(request.Password, user.password);

        if (!passwordCorrect)
        {
            return (false, "Invalid email or password", null);
        }

        UserSession.id = user.id;
        UserSession.name = user.name;
        UserSession.surname = user.surname;
        UserSession.email = user.email;
        UserSession.password = user.password;
        UserSession.role = user.role.ToString();
        UserSession.dateCreated = user.dateCreated;
        
        var auditLog = new AuditLog
        {
            userID = user.id,
            action = AuditAction.login,
            description = $"{user.name} {user.surname} logged into the system."
        };

        _database.AuditLogs.Add(auditLog);

        await _database.SaveChangesAsync();
        
        Employee? employee = null;

        if (
            user.role == UserRole.admin ||
            user.role == UserRole.banker
        )
        {
            employee = await _database.Employees
                .FirstOrDefaultAsync(e => e.id == user.id);
        }

        var response = new LoginResponse
        {
            Id = user.id,
            Name = user.name,
            Surname = user.surname,
            Email = user.email,
            Role = user.role.ToString(),
            EmployeeID = employee?.employee_id
        };

        return (true, "Login successful", response);
    }
}