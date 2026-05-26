using backend.Data;
using backend.DTOs.banker;
using backend.Enums;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.banker;

public class BankerEditClientService
{
    private readonly AppDbContext _database;

    public BankerEditClientService(AppDbContext database)
    {
        _database = database;
    }

    public async Task<EditClientResponse?> GetClientById(int userId)
    {
        var client = await _database.Clients
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.id == userId);

        if (client == null)
            return null;

        return new EditClientResponse
        {
            id = client.User.id,
            clientID = client.client_id,
            name = client.User.name,
            surname = client.User.surname,
            balance = client.balance,
            accountNumber = client.accountNumber,
            email = client.User.email,
            password = null
        };
    }

    public async Task<(bool success, string message, EditClientResponse? data)> EditClient(EditClientResponse request)
    {
        var client = await _database.Clients
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.id == request.id);

        if (client == null)
            return (false, "Client not found", null);

        var user = client.User;

        bool nameChanged = user.name != request.name || user.surname != request.surname;

        user.name = request.name;
        user.surname = request.surname;
        user.email = request.email;

        client.balance = request.balance;

        if (nameChanged)
        {
            var notification = new Notification
            {
                userID = user.id,
                type = NotificationType.balance_updated,
                message = $"Your personal details were updated by {UserSession.name} {UserSession.surname}.",
                isRead = false
            };

            _database.Notifications.Add(notification);
        }

        var auditLog = new AuditLog
        {
            userID = user.id,
            action = AuditAction.update_user,
            description = $"Client {user.name} {user.surname} was updated by {UserSession.name} {UserSession.surname}."
        };

        _database.AuditLogs.Add(auditLog);

        await _database.SaveChangesAsync();

        return (true, "Client updated successfully", new EditClientResponse
        {
            id = user.id,
            clientID = client.client_id,
            name = user.name,
            surname = user.surname,
            balance = client.balance,
            accountNumber = client.accountNumber,
            email = user.email,
            password = null
        });
    }

    public async Task<bool> UpdateBalance(int userId, decimal newBalance)
    {
        var client = await _database.Clients
            .FirstOrDefaultAsync(c => c.id == userId);

        if (client == null)
            return false;

        client.balance = newBalance;

        var auditLog = new AuditLog
        {
            userID = userId,
            action = AuditAction.update_balance,
            description = $"Balance updated to {newBalance} by {UserSession.name} {UserSession.surname}."
        };

        _database.AuditLogs.Add(auditLog);

        await _database.SaveChangesAsync();
        return true;
    }
}