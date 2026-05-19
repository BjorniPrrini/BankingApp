using backend.Enums;

namespace backend.Models;

public class User
{
    public int id { get; set; }
    public string name { get; set; }
    public string surname { get; set; }
    public string email { get; set; }
    public string password { get; set; }
    public UserRole role { get; set; }
    public DateTime dateCreated { get; set; }
}