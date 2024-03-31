using System.Net;
using MediatR;
using Pepegov.MicroserviceFramework.ApiResults;
using Pepegov.MicroserviceFramework.Data.Exceptions;
using Pepegov.MicroserviceFramework.Exceptions;
using Pepegov.Chat.Server.BL.Interfaces;

namespace Pepegov.Chat.Server.PL.EndPoints.Room.Handlers;

public class DeleteRoomCommand : IRequest<ApiResult>
{
    public DeleteRoomCommand() {}
    
    public DeleteRoomCommand(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
    
}

public class DeleteRoomCommandHandler : IRequestHandler<DeleteRoomCommand, ApiResult>
{
    private readonly ILogger<DeleteRoomCommandHandler> _logger;
    private readonly IRoomService _roomService;
    
    public DeleteRoomCommandHandler(ILogger<DeleteRoomCommandHandler> logger, IRoomService roomService)
    {
        _logger = logger;
        _roomService = roomService;
    }

    public async Task<ApiResult> Handle(DeleteRoomCommand request, CancellationToken cancellationToken)
    {
        try
        {
            await _roomService.DeleteAsync(request.Id, cancellationToken);
            return new ApiResult(HttpStatusCode.OK);
        }
        catch (MicroserviceDatabaseException ex)
        {
            return new ApiResult(HttpStatusCode.InternalServerError, ex);
        }
        catch (Exception ex)
        {
            var errorMessage = $"Delete room has throw exception: {ex.Message}";
            _logger.LogError(errorMessage);
            return new ApiResult(HttpStatusCode.InternalServerError, new MicroserviceException(errorMessage));
        }
    }
}