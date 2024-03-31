namespace Pepegov.Chat.Server.DAL.Models;

public class Room
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public int MemberCount { get; set; }
    public Guid Owner { get; set; }
    public IList<Connection> Connections { get; set; } = new List<Connection>();
}