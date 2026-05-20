namespace backend.DTOs.auth;

public class LoginResponse
{
    public int ID { get; set; }

    public string Name { get; set; }

    public string Surname { get; set; }

    public string Email { get; set; }

    public string Role { get; set; }
    
    public int? EmployeeID { get; set; }
}