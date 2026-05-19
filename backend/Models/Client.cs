namespace backend.Models;

public class Client
{
    public int id { get; set; }
    public int clientID { get; set; }
    public string accountNumber { get; set; }
    public decimal amount { get; set; }

    public User User { get; set; }
}