namespace backend.DTOs.auth;

public class LoginResponse
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Surname { get; set; }

    public string Email { get; set; }

    public string Role { get; set; }
}