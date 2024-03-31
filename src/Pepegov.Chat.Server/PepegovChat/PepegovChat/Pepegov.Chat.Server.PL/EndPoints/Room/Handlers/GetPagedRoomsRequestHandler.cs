using System.Net;
using AutoMapper;
using MediatR;
using Pepegov.MicroserviceFramework.ApiResults;
using Pepegov.MicroserviceFramework.Data.Exceptions;
using Pepegov.UnitOfWork.Entityes;
using Pepegov.Chat.Server.BL.Interfaces;
using Pepegov.Chat.Server.PL.EndPoints.Room.ViewModel;

namespace Pepegov.Chat.Server.PL.EndPoints.Room.Handlers;

public sealed class GetPagedRoomsRequest : IRequest<ApiResult<IPagedList<RoomViewModel>>>
{
    public GetPagedRoomsRequest() { }
    
    public GetPagedRoomsRequest(int pageIndex, int pageSize)
    {
        PageIndex = pageIndex;
        PageSize = pageSize;
    }

    public int PageIndex { get; set; }
    public int PageSize { get; set; }
}

public class GetPagedRoomsRequestHandler : IRequestHandler<GetPagedRoomsRequest, ApiResult<IPagedList<RoomViewModel>>>
{
    private readonly ILogger<GetPagedRoomsRequestHandler> _logger;
    private readonly IRoomService _roomService;
    private readonly IMapper _mapper;
    
    public GetPagedRoomsRequestHandler(ILogger<GetPagedRoomsRequestHandler> logger, IRoomService roomService, IMapper mapper)
    {
        _logger = logger;
        _roomService = roomService;
        _mapper = mapper;
    }

    public async Task<ApiResult<IPagedList<RoomViewModel>>> Handle(GetPagedRoomsRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result =await _roomService.GetPagedListAsync(request.PageIndex, request.PageSize, cancellationToken);
            var pagedResult = _mapper.Map<PagedList<RoomViewModel>>(result);
            return new ApiResult<IPagedList<RoomViewModel>>(pagedResult, HttpStatusCode.OK);
        }
        catch (Exception ex)
        {
            var errorMessage = $"Unhandled exception: {ex.Message}";
            _logger.LogError(errorMessage);
            return new ApiResult<IPagedList<RoomViewModel>>(HttpStatusCode.InternalServerError,
                new MicroserviceException(errorMessage));
        }
    }
}