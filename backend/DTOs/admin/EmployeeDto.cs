namespace backend.DTOs.admin;

public class EmployeeDto
{
    public int Id { get; set; }
    public int EmployeeID { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public decimal PayCheck { get; set; }
    public string Email { get; set; }
}