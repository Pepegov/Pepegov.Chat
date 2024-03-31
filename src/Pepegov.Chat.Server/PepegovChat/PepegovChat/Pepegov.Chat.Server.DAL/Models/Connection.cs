using System.ComponentModel.DataAnnotations;

namespace Pepegov.Chat.Server.DAL.Models;

public class Connection
{
    [Key]
    public string ConnectionId { get; set; } = null!;
    public string UserName { get; set; } = null!;

    public Connection(string connectionId, string userName)
    {
        ConnectionId = connectionId;
        UserName = userName;
    }
    
    public Connection() {}
}