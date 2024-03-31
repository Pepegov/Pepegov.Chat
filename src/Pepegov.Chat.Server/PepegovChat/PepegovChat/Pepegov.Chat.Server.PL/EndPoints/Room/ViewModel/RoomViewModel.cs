namespace Pepegov.Chat.Server.PL.EndPoints.Room.ViewModel;

public class RoomViewModel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public int MemberCount { get; set; }
    public Guid Owner { get; set; }
    public IEnumerable<ConnectionViewModel> Connections { get; set; } = new List<ConnectionViewModel>();
}