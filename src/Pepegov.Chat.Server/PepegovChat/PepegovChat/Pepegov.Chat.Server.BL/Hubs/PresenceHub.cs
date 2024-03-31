using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using OpenIddict.Abstractions;
using Pepegov.Chat.Server.DAL.Domain;
using Pepegov.Chat.Server.DAL.ViewModels;
using Pepegov.MicroserviceFramework.Infrastructure.Helpers;
using SignalRSwaggerGen.Attributes;

namespace Pepegov.Chat.Server.BL.Hubs
{
    [SignalRHub]
    [Authorize(AuthenticationSchemes = AuthData.AuthenticationSchemes)]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        private readonly ILogger<PresenceHub> _logger;
        public PresenceHub(PresenceTracker tracker, ILogger<PresenceHub> logger)
        {
            _tracker = tracker;
            _logger = logger;
        }
        public override async Task OnConnectedAsync()
        {
            _logger.LogInformation($"{nameof(PresenceHub)}.{nameof(OnConnectedAsync)}");
            var httpContext = Context.GetHttpContext();
            var Id = httpContext.Request.Query["roomId"].ToString();
            var IdGuid = Guid.Parse(Id);

            var userName = ClaimsHelper.GetValue<string>((ClaimsIdentity)Context.User.Identity, OpenIddictConstants.Claims.Name);
            var isOnline = await _tracker.UserConnected(new UserConnectionInfo(userName, IdGuid), Context.ConnectionId);            
        }
        
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            _logger.LogInformation($"{nameof(PresenceHub)}.{nameof(OnDisconnectedAsync)} ex {exception.Message}");
            var httpContext = Context.GetHttpContext();
            var Id = httpContext.Request.Query["roomId"].ToString();
            var IdGuid = Guid.Parse(Id);
            
            var userName = ClaimsHelper.GetValue<string>((ClaimsIdentity)Context.User.Identity, OpenIddictConstants.Claims.Name);
            var isOffline = await _tracker.UserDisconnected(new UserConnectionInfo(userName, IdGuid), Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
