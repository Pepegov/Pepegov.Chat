namespace Pepegov.Chat.Server.DAL.ViewModels;

public class UserConnectionInfo
{
    public UserConnectionInfo() { }
    public UserConnectionInfo(string userName, Guid roomId)
    {
        UserName = userName;
        RoomId = roomId;
    }
    public string UserName { get; set; }
    public Guid RoomId { get; set; }
}