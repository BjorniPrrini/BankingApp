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
    
    public async Task<EditClientResponse?> GetClientById(int id)
    {
        return await _database.Clients
            .Include(c => c.User)
            .Where(c => c.id == id)
            .Select(c => new EditClientResponse
            {
                id = c.User.id,
                clientID = c.client_id,
                name = c.User.name,
                surname = c.User.surname,
                balance = c.balance,
                accountNumber=c.accountNumber,
                email = c.User.email,
                password = c.User.name.ToLower() + c.User.surname.ToLower() + c.client_id,
            })
            .FirstOrDefaultAsync();
    }
    
    public async Task<(bool success, string message, EditClientResponse? data)> EditClient(EditClientResponse request)
    {
        var user = await _database.Users.FindAsync(request.id);
        var client = await _database.Clients.FindAsync(request.id);

        int clientID = client.client_id;
        string accountNumber = client.accountNumber;
        string plainPassword = user.name.ToLower() + user.surname.ToLower() + clientID;
        
        if (user.name != request.name || user.surname != request.surname) 
        {
            Random random = new Random();
        
            do
            {
                clientID = random.Next(100000, 999999);
                accountNumber = "ALB" + random.Next(10000000, 99999999);
            } while (await _database.Clients.AnyAsync(c => c.client_id == clientID || c.accountNumber == accountNumber));

           
            plainPassword = request.name.ToLower() + request.surname.ToLower() + clientID;

            user.name = request.name;
            user.surname = request.surname;
            user.email = request.email;
            user.password = BCrypt.Net.BCrypt.HashPassword(plainPassword);
            client.client_id = clientID;
        }
        client.balance = request.balance;

        var notification = new Notification {
            userID = user.id,
            type = NotificationType.login_detected,
            message = $"Your account has been edited by {UserSession.name} {UserSession.surname}!",
            isRead = false
        };
        _database.Notifications.Add(notification);
        
        var auditLog = new AuditLog {
            userID = user.id,
            action = AuditAction.update_user, 
            description = $"Client {request.name} {request.surname} was edited by {UserSession.name} {UserSession.surname}.",
        };
        _database.AuditLogs.Add(auditLog);
        
        await _database.SaveChangesAsync();

        return (true, "Client edited successfully", new EditClientResponse {
            name = user.name,
            surname = user.surname,
            balance = client.balance,
            clientID = clientID,
            accountNumber = accountNumber,
            email = request.email,
            password = plainPassword
        });
    }
    
    public async Task<bool> UpdateBalance(int id, decimal newBalance)
    {
        var client = await _database.Clients.FindAsync(id);

        if (client == null)
            return false;

        client.balance = newBalance;
        await _database.SaveChangesAsync();
        return true;
    }
    
}