using backend.Data;
using backend.DTOs.banker;
using backend.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.banker;

public class BankerHomePage
{
    private readonly AppDbContext _context;

    public BankerHomePage(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ClientDto>> GetAllClients()
    {
        return await _context.Clients
            .Include(c => c.User)
            .Where(c => c.User.role == UserRole.client)
            .Select(c => new ClientDto
            {
                Id = c.User.id,
                ClientID = c.client_id,
                Name = c.User.name,
                Surname = c.User.surname,
                Balance = c.balance,
                accountNumber=c.accountNumber,
                Email = c.User.email,
            })
            .ToListAsync();
    }

    public async Task<ClientDto?> GetClientById(int id)
    {
        return await _context.Clients
            .Include(c => c.User)
            .Where(c => c.id == id)
            .Select(c => new ClientDto
            {
                Id = c.User.id,
                ClientID = c.client_id,
                Name = c.User.name,
                Surname = c.User.surname,
                Balance = c.balance,
                accountNumber=c.accountNumber,
                Email = c.User.email,
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> DeleteClient(int id)
    {
        var client = await _context.Clients
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.id == id);

        if (client == null)
            return false;

        _context.Clients.Remove(client);
        _context.Users.Remove(client.User);

        await _context.SaveChangesAsync();

        return true;
    }
}