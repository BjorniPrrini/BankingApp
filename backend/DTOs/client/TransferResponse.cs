namespace backend.DTOs.client;

public class TransferResponse
{
    public int TxId { get; set; }
    public string SenderIban { get; set; }
    public string RecipientIban { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
}