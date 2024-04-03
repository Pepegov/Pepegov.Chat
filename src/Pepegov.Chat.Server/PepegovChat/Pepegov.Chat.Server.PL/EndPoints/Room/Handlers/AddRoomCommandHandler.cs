using System.Net;
using AutoMapper;
using MediatR;
using Pepegov.MicroserviceFramework.ApiResults;
using Pepegov.MicroserviceFramework.Data.Exceptions;
using Pepegov.MicroserviceFramework.Exceptions;
using Pepegov.Chat.Server.BL.Interfaces;
using Pepegov.Chat.Server.PL.EndPoints.Room.ViewModel;

namespace Pepegov.Chat.Server.PL.EndPoints.Room.Handlers;

public class AddRoomCommand : IRequest<ApiResult>
{
    public AddRoomCommand() { }
    
    public AddRoomCommand(RoomViewModel model)
    {
        Model = model;
    }

    public RoomViewModel Model { get; set; }
}

public class AddRoomCommandHandler : IRequestHandler<AddRoomCommand, ApiResult>
{
    private readonly ILogger<AddRoomCommandHandler> _logger;
    private readonly IRoomService _roomService;
    private readonly IMapper _mapper;
    
    public AddRoomCommandHandler(ILogger<AddRoomCommandHandler> logger, IRoomService roomService, IMapper mapper)
    {
        _logger = logger;
        _roomService = roomService;
        _mapper = mapper;
    }

    public async Task<ApiResult> Handle(AddRoomCommand request, CancellationToken cancellationToken)
    {
        var entity = _mapper.Map<Pepegov.Chat.Server.DAL.Models.Room>(request.Model);
        try
        {
            await _roomService.InsertAsync(entity, cancellationToken);
            return new ApiResult(HttpStatusCode.OK);
        }
        catch (MicroserviceDatabaseException ex)
        {
            return new ApiResult(HttpStatusCode.InternalServerError, ex);
        }
        catch (Exception ex)
        {
            var errorMessage = $"Add room has throw exception: {ex.Message}";
            _logger.LogError(errorMessage);
            return new ApiResult(HttpStatusCode.InternalServerError, new MicroserviceException(errorMessage));
        }
    }
}