namespace backend.DTOs.banker;

public class ClientDto
{
    public int Id { get; set; }
    public int ClientID { get; set; }
    public int accountNumber { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public decimal Balance { get; set; }
    public string Email { get; set; }
}