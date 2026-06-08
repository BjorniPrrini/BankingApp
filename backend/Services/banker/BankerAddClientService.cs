using backend.Data;
using backend.DTOs.banker;
using backend.Enums;
using backend.Models;
using backend.Services.notifications;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.banker;

public class BankerAddClientService
{
    private readonly AppDbContext _database;
    private readonly INotificationService _notificationService;

    public BankerAddClientService(AppDbContext database, INotificationService notificationService)
    {
        _database = database;
        _notificationService = notificationService;
    }

    public async Task<(bool success, string message, AddClientResponse? data)> AddClient(AddClientRequest request)
    {
        bool clientExists = await _database.Users.AnyAsync(u => u.name == request.name && u.surname == request.surname);

        if (clientExists)
        {
            return (false, "This client is already registered", null);
        }

        string accountNumber;
        Random random = new Random();
        
        do {
            accountNumber = "ALB" + random.Next(10000000, 99999999);
        } while (await _database.Clients.AnyAsync(c => c.accountNumber == accountNumber));
        
        string generatedPassword = request.name.ToLower() + request.surname.ToLower();

        var user = new User
        {
            name = request.name,
            surname = request.surname,
            email = request.email,
            password = BCrypt.Net.BCrypt.HashPassword(generatedPassword),
            role = UserRole.client
        };
        _database.Users.Add(user);

        await _database.SaveChangesAsync();

        var client = new Client
        {
            id = user.id,
            accountNumber = accountNumber,
            balance = request.balance
        };

        _database.Clients.Add(client);
        
        await _notificationService.SendAsync(user.id, NotificationType.account_created, $"Welcome {request.name} {request.surname}! Your account has been created.");
        
        var autidLog = new AuditLog {
            userID = user.id,
            action = AuditAction.create_banker,
            description = $"Client {request.name} {request.surname} was created by {UserSession.name} {UserSession.surname}.",
        };
        _database.AuditLogs.Add(autidLog);
        
        await _database.SaveChangesAsync();
        
        return (true, "Client added successfully", new AddClientResponse {
            clientID = client.client_id,
            password = generatedPassword
        });
    }
}