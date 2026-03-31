namespace CURDDemo.Model;

public class AuthUser
{
    public int Id { get; set; }

    public required string Username { get; set; }

    public required string Password { get; set; }
}