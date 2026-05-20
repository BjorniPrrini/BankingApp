namespace backend.DTOs.admin;

public class EditEmployeeResponse
{
    public int id { get; set; }
    public string name { get; set; }
    public string surname { get; set; }
    public decimal salary { get; set; }
    public int employeeID { get; set; }
    public string? email { get; set; }
    public string? password { get; set; }
}