using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pepegov.Chat.Server.DAL.Domain;
using Pepegov.Chat.Server.PL.EndPoints.Room.Handlers;
using Pepegov.Chat.Server.PL.EndPoints.Room.ViewModel;
using Pepegov.MicroserviceFramework.ApiResults;
using Pepegov.MicroserviceFramework.AspNetCore.WebApi;
using Pepegov.MicroserviceFramework.AspNetCore.WebApplicationDefinition;
using Pepegov.MicroserviceFramework.Definition;
using Pepegov.MicroserviceFramework.Definition.Context;
using Pepegov.UnitOfWork.Entityes;

namespace Pepegov.Chat.Server.PL.EndPoints.Room;

public class RoomEndPoint : ApplicationDefinition
{
    public override Task ConfigureApplicationAsync(IDefinitionApplicationContext context)
    {
        var app = context.Parse<WebDefinitionApplicationContext>().WebApplication;

        app.MapGet("~/api/room/get-paged", GetPagedRooms)
            .WithOpenApi()
            .WithTags("Room");
        app.MapPost("~/api/room/add", AddRoom)
            .WithOpenApi()
            .WithTags("Room");
        app.MapPut("~/api/room/edit", EditRoom)
            .WithOpenApi()
            .WithTags("Room");
        app.MapDelete("~/api/room/delete", DeleteRoom)
            .WithOpenApi()
            .WithTags("Room");
        
        return base.ConfigureApplicationAsync(context);
    }

    [ProducesResponseType(typeof(ApiResult<IPagedList<RoomViewModel>>), 200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    [Authorize(AuthenticationSchemes = AuthData.AuthenticationSchemes)]
    private async Task<IResult> GetPagedRooms(
        HttpContext httpContext,
        [FromQuery] int pageIndex,
        [FromQuery] int pageSize,
        [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(new GetPagedRoomsRequest(pageIndex, pageSize), httpContext.RequestAborted);
        return Results.Extensions.Custom(result);
    }

    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    [Authorize(AuthenticationSchemes = AuthData.AuthenticationSchemes)]
    private async Task<IResult> AddRoom(
        HttpContext httpContext,
        [FromQuery] string name,
        [FromServices] IMediator mediator)
    {
        // Guid.TryParse(httpContext.User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value, out var currentId);
        // if (currentId == Guid.Empty)
        // {
        //     var unauthorizedResult = new ApiResult(HttpStatusCode.Unauthorized,
        //         new MicroserviceUnauthorizedException("The claim not contains the id"));
        //     return Results.Extensions.Custom(unauthorizedResult);
        // }
        
        var result = await mediator.Send(new AddRoomCommand(new RoomViewModel() { Name = name, Owner = Guid.Empty}), httpContext.RequestAborted);
        return Results.Extensions.Custom(result);
    }

    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    [Authorize(AuthenticationSchemes = AuthData.AuthenticationSchemes)]
    private async Task<IResult> EditRoom(
        HttpContext httpContext,
        [FromQuery] Guid id,
        [FromQuery] string name,
        [FromServices] IMediator mediator
        )
    {
        var result = await mediator.Send(new EditRoomCommand(id, name), httpContext.RequestAborted);
        return Results.Extensions.Custom(result);
    }

    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    [Authorize(AuthenticationSchemes = AuthData.AuthenticationSchemes, Roles = UserRoles.Admin)]
    private async Task<IResult> DeleteRoom(
        HttpContext httpContext,
        [FromQuery] Guid id,
        [FromServices] IMediator mediator
        )
    {
        var result = await mediator.Send(new DeleteRoomCommand(id), httpContext.RequestAborted);
        return Results.Extensions.Custom(result);
    }
}