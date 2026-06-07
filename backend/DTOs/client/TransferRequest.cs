namespace backend.DTOs.client;

public class TransferRequest
{
    public int SenderUserId { get; set; }
    public string RecipientIban { get; set; }
    public decimal Amount { get; set; }
}