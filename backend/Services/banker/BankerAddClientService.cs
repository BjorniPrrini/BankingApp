using backend.Data;
using backend.DTOs.banker;
using backend.Enums;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.banker;

public class BankerAddClientService
{
    private readonly AppDbContext _database;

    public BankerAddClientService(AppDbContext database)
    {
        _database = database;
    }

    public async Task<(bool success, string message, AddClientResponse? data)> AddClient(AddClientRequest request)
    {
        bool clientExists = await _database.Users.AnyAsync(u => u.name == request.name && u.surname == request.surname);

        if (clientExists)
        {
            return (false, "This client is already registered", null);
        }

        int clientID;
        string accountNumber;
        Random random = new Random();

        do
        {
            clientID = random.Next(100000, 999999);
            accountNumber = "ALB" + random.Next(10000000, 99999999);
        } while (await _database.Clients.AnyAsync(c => c.client_id == clientID || c.accountNumber == accountNumber));
        
        string generatedPassword = BCrypt.Net.BCrypt.HashPassword(request.name.ToLower() + request.surname.ToLower() + clientID);

        var user = new User
        {
            name = request.name,
            surname = request.surname,
            email = request.email,
            password = request.name.ToLower() + request.surname.ToLower() + clientID,
            role = UserRole.client
        };
        _database.Users.Add(user);
        await _database.SaveChangesAsync();
        
        var client = new Client {
            id = user.id,
            client_id = clientID,
            accountNumber= accountNumber,
            balance = request.balance
        };
        _database.Clients.Add(client);
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
            description = $"Client {request.name} {request.surname} was created by {UserSession.name} {UserSession.surname}.",
        };
        _database.AuditLogs.Add(autidLog);
        await _database.SaveChangesAsync();
        
        return (true, "Client added successfully", new AddClientResponse {
            clientID = clientID,
            password = generatedPassword
        });
    }
}