using System.ComponentModel.DataAnnotations;

namespace Pepegov.Chat.Server.PL.EndPoints.Room.ViewModel;

public class ConnectionViewModel
{
    public ConnectionViewModel() { }
    public ConnectionViewModel(string connectionId, string userName)
    {
        ConnectionId = connectionId;
        UserName = userName;
    }
    
    [Key]
    public string ConnectionId { get; set; }
    public string UserName { get; set; }
}