using backend.Data;
using backend.DTOs.client;
using backend.Enums;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.client;

public class ClientTransferService
{
    private readonly AppDbContext _database;

    public ClientTransferService(AppDbContext database)
    {
        _database = database;
    }

    public async Task<(bool success, string message, TransferResponse? data)> Transfer(TransferRequest request)
    {
        if (request.Amount <= 0)
            return (false, "Amount must be greater than zero.", null);
        
        var sender = await _database.Clients
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.id == request.SenderUserId);

        if (sender == null)
            return (false, "Sender account not found.", null);

        var recipient = await _database.Clients
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.accountNumber == request.RecipientIban);

        if (recipient == null)
            return (false, "No account found with that IBAN. Please check and try again.", null);

        if (sender.id == recipient.id)
            return (false, "You cannot transfer money to your own account.", null);

        if (sender.balance < request.Amount)
            return (false, $"Insufficient funds. Your balance is ALL {sender.balance:F2}.", null);

        sender.balance    -= request.Amount;
        recipient.balance += request.Amount;

        var transaction = new TransactionHistory
        {
            senderID   = sender.id,
            receiverID = recipient.id,
            amount     = request.Amount,
            status     = TransactionStatus.completed
        };
        _database.TransactionHistories.Add(transaction);
        await _database.SaveChangesAsync();

        _database.Notifications.Add(new Notification
        {
            userID  = sender.id,
            type    = NotificationType.transaction_sent,
            message = $"You sent ALL {request.Amount:F2} to {recipient.User.name} {recipient.User.surname} ({recipient.accountNumber}).",
            isRead  = false
        });

        _database.Notifications.Add(new Notification
        {
            userID  = recipient.id,
            type    = NotificationType.transaction_received,
            message = $"You received ALL {request.Amount:F2} from {sender.User.name} {sender.User.surname} ({sender.accountNumber}).",
            isRead  = false
        });

        _database.AuditLogs.Add(new AuditLog
        {
            userID      = sender.id,
            action      = AuditAction.create_transaction,
            description = $"{sender.User.name} {sender.User.surname} transferred ALL {request.Amount:F2} to {recipient.User.name} {recipient.User.surname} (IBAN: {recipient.accountNumber}). TX ID: {transaction.id}."
        });

        await _database.SaveChangesAsync();

        return (true, "Transfer completed successfully.", new TransferResponse
        {
            TxId          = transaction.id,
            SenderIban    = sender.accountNumber,
            RecipientIban = recipient.accountNumber,
            Amount        = transaction.amount,
            Date          = transaction.transactionTimestamp
        });
    }

    public async Task<List<TransactionDto>> GetTransactions(int userId)
    {
        var transactions = await _database.TransactionHistories
            .Where(t => t.senderID == userId || t.receiverID == userId)
            .OrderByDescending(t => t.transactionTimestamp)
            .ToListAsync();

        var userIds = transactions
            .SelectMany(t => new[] { t.senderID, t.receiverID })
            .Distinct()
            .ToList();

        var ibanMap = await _database.Clients
            .Where(c => userIds.Contains(c.id))
            .ToDictionaryAsync(c => c.id, c => c.accountNumber);

        return transactions.Select(t => new TransactionDto
        {
            TxId          = t.id,
            SenderId      = t.senderID,
            RecipientId   = t.receiverID,
            SenderIban    = ibanMap.GetValueOrDefault(t.senderID, "—"),
            RecipientIban = ibanMap.GetValueOrDefault(t.receiverID, "—"),
            Amount        = t.amount,
            Status        = t.status.ToString(),
            Date          = t.transactionTimestamp
        }).ToList();
    }
}