namespace backend.DTOs.banker;

public class UpdateBalanceRequest
{
    public int id { get; set; }
    public decimal balance { get; set; }
}