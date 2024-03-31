namespace Pepegov.Chat.Server.DAL.ViewModels;

public class MessageViewModel
{
    public string SenderDisplayName { get; set; } = null!;
    public string SenderUsername { get; set; } = null!;
    public string Content { get; set; } = null!;
    public DateTime SendedDateTime { get; set; }
}