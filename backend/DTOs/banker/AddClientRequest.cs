namespace backend.DTOs.banker;

public class AddClientRequest
{
    public string name { get; set; }
    public string surname { get; set; }
    public decimal balance { get; set; }
    public string email  { get; set; }
}