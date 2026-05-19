using backend.Enums;

namespace backend.Models;

public class AuditLog
{
    public int id { get; set; }
    public int userID { get; set; }
    public AuditAction action { get; set; }
    public string description { get; set; }
    public string ipAddress { get; set; }
    public DateTime createdAt { get; set; }

    public User User { get; set; }
}