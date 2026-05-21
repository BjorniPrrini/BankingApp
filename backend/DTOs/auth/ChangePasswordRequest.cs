namespace backend.DTOs.auth;

public class ChangePasswordRequest
{
    public int id { get; set; }
    public string oldPassword { get; set; }
    public string newPassword { get; set; }
}