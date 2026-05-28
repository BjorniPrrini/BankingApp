using backend.Data;
using backend.Enums;
using backend.Hubs;
using backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace backend.Services.notifications;

public interface INotificationService
{
    Task SendAsync(int userId, NotificationType type, string message);
}

public class NotificationService : INotificationService
{
    private readonly AppDbContext _database;
    private readonly IHubContext<NotificationHub> _hub;

    public NotificationService(AppDbContext database, IHubContext<NotificationHub> hub)
    {
        _database = database;
        _hub = hub;
    }

    public async Task SendAsync(int userId, NotificationType type, string message)
    {
        var notif = new Notification
        {
            userID = userId,
            type = type,
            message = message
        };

        _database.Notifications.Add(notif);
        await _database.SaveChangesAsync();

        await _hub.Clients
            .Group($"user_{userId}")
            .SendAsync("ReceiveNotification", notif);
    }
}