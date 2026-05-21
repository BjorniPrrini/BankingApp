namespace backend.DTOs.banker;

public class EditClientResponse
{
    public int id { get; set; }
    public int? clientID { get; set; }
    
    public string name { get; set; }
    
    public string surname { get; set; }
    
    public decimal balance { get; set; }
    
    public string email { get; set; }
    
    public string? accountNumber { get; set; }
    
    public string? password { get; set; }
}