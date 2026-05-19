namespace backend.Models;

public static class UserSession
{
    public static int id { get; set; }
    public static string name { get; set; }
    public static string surname { get; set; }
    public static string email { get; set; }
    public static string password { get; set; }
    public static string role { get; set; }
    public static DateTime dateCreated { get; set; }
}