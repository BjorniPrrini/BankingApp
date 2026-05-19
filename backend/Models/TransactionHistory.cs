using backend.Enums;

namespace backend.Models;

public class TransactionHistory
{
    public int id { get; set; }
    public int senderID { get; set; }
    public int receiverID { get; set; }
    public decimal amount { get; set; }
    public TransactionStatus status { get; set; }
    public DateTime transactionTimestamp { get; set; }

    public User Sender { get; set; }
    public User Receiver { get; set; }
}