namespace Pepegov.Chat.Server.PL.Definitions.Options.Models;

public class IdentityAddressOption
{
    public string Authority { get; set; } = null!;
    public string? Audience { get; set; }
}