using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Client
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int id { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int client_id { get; set; }

    public string accountNumber { get; set; }
    public decimal balance { get; set; }

    public User User { get; set; }
}