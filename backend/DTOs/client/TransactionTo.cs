namespace backend.DTOs.client;

public class TransactionDto
{
    public int TxId { get; set; }
    public int SenderId { get; set; }
    public int RecipientId { get; set; }
    public string SenderIban { get; set; }
    public string RecipientIban { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; }
    public DateTime Date { get; set; }
}