namespace backend.DTOs.admin;

public class EditEmployeeRequest
{
    public string name { get; set; }
    public string surname { get; set; }
    public decimal paycheck { get; set; }
    public decimal id { get; set; }
    public decimal email { get; set; }
    public decimal password { get; set; }
}