using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Pepegov.Chat.Server.DAL.Domain;
using SignalRSwaggerGen.Attributes;

namespace Pepegov.Chat.Server.BL.Hubs;

[SignalRHub]
[Authorize(AuthenticationSchemes = AuthData.AuthenticationSchemes)]
public class SignalingHub : Hub
{
    private readonly ILogger<SignalingHub> _logger;

    public SignalingHub(ILogger<SignalingHub> logger)
    {
        _logger = logger;
    }

    public async Task JoinRoom(string roomName)
    {
        _logger.LogInformation($"[Signaling] Add {Context.ConnectionId} to room {roomName}");
        await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        _logger.LogInformation($"[Signaling] Send new_user event to room {roomName}");
        await Clients.OthersInGroup(roomName).SendAsync("new_user", Context.ConnectionId);
    }

    public async Task SendOffer(string roomName, string connectionId, object description)
    {
        _logger.LogInformation($"SendOffer in room {roomName}. ConnectionId: {connectionId}. Description: {description}");
        await Clients.Client(connectionId).SendAsync("offer", Context.ConnectionId, description);
    }

    public async Task SendAnswer(string roomName, string connectionId, object description)
    {
        await Clients.Client(connectionId).SendAsync("answer", Context.ConnectionId, description);
    }

    public async Task SendIceCandidate(string roomName, string connectionId, object? candidate)
    {
        if (candidate is null)
        {
            return;
        }

        try
        {
            await Clients.Client(connectionId).SendAsync("ice_candidate", Context.ConnectionId, candidate);
            _logger.LogInformation($"[Signaling] Send ice_candidate method in {Context.ConnectionId}. Candidate: {candidate}");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
        }
    }
}