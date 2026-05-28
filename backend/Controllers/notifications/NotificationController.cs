using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.notifications;

[ApiController]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _database;

    public NotificationsController(AppDbContext database)
    {
        _database = database;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetForUser(int userId)
    {
        var notifs = await _database.Notifications
            .Where(n => n.userID == userId)
            .OrderByDescending(n => n.createdAt)
            .Select(n => new
            {
                n.id,
                n.userID,
                type = n.type.ToString(),
                n.message,
                n.isRead,
                n.createdAt
            })
            .ToListAsync();

        return Ok(notifs);
    }

    [HttpPost("mark-read/{id}")]
    public async Task<IActionResult> MarkRead(int id)
    {
        var notif = await _database.Notifications.FindAsync(id);

        if (notif == null)
        {
            return NotFound();
        }

        notif.isRead = true;
        
        await _database.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("mark-all-read/{userId}")]
    public async Task<IActionResult> MarkAllRead(int userId)
    {
        var unread = await _database.Notifications
            .Where(n => n.userID == userId && !n.isRead)
            .ToListAsync();

        unread.ForEach(n => n.isRead = true);
        
        await _database.SaveChangesAsync();

        return Ok();
    }
}