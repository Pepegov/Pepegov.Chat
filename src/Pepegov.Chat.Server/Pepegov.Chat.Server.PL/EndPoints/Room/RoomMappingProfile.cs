using AutoMapper;
using Pepegov.Chat.Server.DAL.Models;
using Pepegov.Chat.Server.PL.Definitions.Mapping;
using Pepegov.Chat.Server.PL.EndPoints.Room.ViewModel;
using Pepegov.UnitOfWork.Entityes;

namespace Pepegov.Chat.Server.PL.EndPoints.Room;

public class RoomMappingProfile : Profile
{
    public RoomMappingProfile()
    {
        CreateMap<RoomViewModel, Pepegov.Chat.Server.DAL.Models.Room>();
        CreateMap<Pepegov.Chat.Server.DAL.Models.Room, RoomViewModel>();
        CreateMap<Connection, ConnectionViewModel>();
        CreateMap<ConnectionViewModel, Connection>()
            .ForMember(x => x.ConnectionId, i => i.MapFrom(a => a.ConnectionId))
            .ForMember(x => x.UserName, i => i.MapFrom(a => a.UserName));
    }
}