using System.Net;
using AutoMapper;
using MediatR;
using Pepegov.MicroserviceFramework.ApiResults;
using Pepegov.MicroserviceFramework.Data.Exceptions;
using Pepegov.MicroserviceFramework.Exceptions;
using Pepegov.Chat.Server.BL.Interfaces;
using Pepegov.Chat.Server.PL.EndPoints.Room.ViewModel;

namespace Pepegov.Chat.Server.PL.EndPoints.Room.Handlers;

public class EditRoomCommand : IRequest<ApiResult>
{
    public EditRoomCommand()
    {
    }
    
    public EditRoomCommand(Guid id, string name)
    {
        Id = id;
        Name = name;
    }

    public Guid Id { get; set; }
    public string Name { get; set; }
}

public class EditRoomCommandHandler : IRequestHandler<EditRoomCommand, ApiResult>
{
    private readonly ILogger<EditRoomCommandHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IRoomService _roomService;
    
    public EditRoomCommandHandler(ILogger<EditRoomCommandHandler> logger, IRoomService roomService, IMapper mapper)
    {
        _logger = logger;
        _roomService = roomService;
        _mapper = mapper;
    }

    public async Task<ApiResult> Handle(EditRoomCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var entity = await _roomService.GetByIdAsync(request.Id, cancellationToken);
            entity.Name = request.Name;
            
            await _roomService.UpdateAsync(entity, cancellationToken);
            return new ApiResult(HttpStatusCode.OK);
        }
        catch (MicroserviceDatabaseException ex)
        {
            return new ApiResult(HttpStatusCode.InternalServerError, ex);
        }
        catch (Exception ex)
        {
            var errorMessage = $"Update room has throw exception: {ex.Message}";
            _logger.LogError(errorMessage);
            return new ApiResult(HttpStatusCode.InternalServerError, new MicroserviceException(errorMessage));
        }
    }
}