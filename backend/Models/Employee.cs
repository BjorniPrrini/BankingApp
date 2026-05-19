namespace backend.Models;

public class Employee
{
    public int id { get; set; }
    public int employee_id { get; set; }
    public decimal salary { get; set; }

    public User User { get; set; }
}