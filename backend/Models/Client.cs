namespace backend.Models;
public class Client
{
    
    public int id { get; set; }
    public int client_id { get; set; }
    
    public string accountNumber { get; set; }
    public decimal balance { get; set; }

    public User User { get; set; }
}