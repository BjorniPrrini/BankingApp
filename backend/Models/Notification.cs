using backend.Enums;

namespace backend.Models;

public class Notification
{
    public int id { get; set; }
    public int userID { get; set; }
    public NotificationType type { get; set; }
    public string message { get; set; }
    public bool isRead { get; set; }
    public DateTime createdAt { get; set; }

    public User User { get; set; }
}