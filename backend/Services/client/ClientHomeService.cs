using backend.Data;
using backend.DTOs.client;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.client;

public class ClientHomeService
{
    private readonly AppDbContext _database;

    public ClientHomeService(AppDbContext database)
    {
        _database = database;
    }

    public async Task<ClientHomeResponse?> GetClientHome(int userId)
    {
        var user = await _database.Users
            .FirstOrDefaultAsync(u => u.id == userId);

        if (user == null)
        {
            return null;
        }

        var client = await _database.Clients
            .FirstOrDefaultAsync(c => c.client_id == userId);

        if (client == null)
        {
            return null;
        }

        return new ClientHomeResponse
        {
            ID = user.id,
            Name = user.name,
            Surname = user.surname,
            Balance = client.balance
        };
    }
}