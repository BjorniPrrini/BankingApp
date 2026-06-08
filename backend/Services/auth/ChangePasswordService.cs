using backend.Data;
using backend.DTOs.auth;
using backend.Enums;
using backend.Models;
using backend.Services.notifications;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.auth;

public class ChangePasswordService
{
    private readonly AppDbContext _database;
    private readonly INotificationService _notifications;

    public ChangePasswordService(AppDbContext database, INotificationService notifications)
    {
        _database = database;
        _notifications = notifications;
    }

    public async Task<(bool success, string message, ChangePasswordResponse? data)> ChangePassword(ChangePasswordRequest request)
    {
        var user = await _database.Users.FirstOrDefaultAsync(u => u.id == request.id);

        if(user == null)
        {
            return (false, "User not found", null);
        }

        bool correct = BCrypt.Net.BCrypt.Verify(request.oldPassword, user.password);

        if (!correct)
        {
            return (false, "Wrong credentials!", null);
        }

        user.password = BCrypt.Net.BCrypt.HashPassword(request.newPassword);

        var auditLog = new AuditLog {
            userID = user.id,
            action = AuditAction.update_banker,
            description = $"Password for {user.name} {user.surname} was changed by {UserSession.name} {UserSession.surname}.",
        };
        _database.AuditLogs.Add(auditLog);
        await _database.SaveChangesAsync();

        await _notifications.SendAsync(user.id, NotificationType.password_changed, "Your password was changed successfully.");

        return (true, "Password changed successfully", new ChangePasswordResponse {
            userRole = user.role.ToString()
        });
    }
}