using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using OpenIddict.Abstractions;
using Pepegov.Chat.Server.BL.Interfaces;
using Pepegov.Chat.Server.DAL.Domain;
using Pepegov.Chat.Server.DAL.Models;
using Pepegov.Chat.Server.DAL.ViewModels;
using Pepegov.MicroserviceFramework.Infrastructure.Helpers;
using Pepegov.UnitOfWork;
using Pepegov.UnitOfWork.EntityFramework;
using SignalRSwaggerGen.Attributes;

namespace Pepegov.Chat.Server.BL.Hubs
{
    [SignalRHub]
    [Authorize(AuthenticationSchemes = AuthData.AuthenticationSchemes)]
    public class ChatHub : Hub
    {
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly ILogger<ChatHub> _logger;
        private readonly PresenceTracker _presenceTracker;
        private readonly UserShareScreenTracker _shareScreenTracker;
        private readonly IUnitOfWorkEntityFrameworkInstance _unitOfWorkEntityFrameworkInstance;
        private readonly IRoomService _roomService;
        
        public ChatHub(IUnitOfWorkManager unitOfWorkManager, 
            UserShareScreenTracker shareScreenTracker, 
            PresenceTracker presenceTracker, 
            IHubContext<PresenceHub> presenceHub, IRoomService roomService, ILogger<ChatHub> logger)
        {
            //_mapper = mapper;
            _unitOfWorkEntityFrameworkInstance = unitOfWorkManager.GetInstance<IUnitOfWorkEntityFrameworkInstance>();
            _presenceTracker = presenceTracker;
            _presenceHub = presenceHub;
            _roomService = roomService;
            _logger = logger;
            _shareScreenTracker = shareScreenTracker;
        }

        public override async Task OnConnectedAsync()
        {
            _logger.LogInformation($"{nameof(OnConnectedAsync)}");

            var httpContext = Context.GetHttpContext();
            var id = httpContext.Request.Query["roomId"].ToString();
            var IdGuid = Guid.Parse(id);
            var userName = ClaimsHelper.GetValue<string>((ClaimsIdentity)Context.User.Identity, OpenIddictConstants.Claims.Name);            

            await _presenceTracker.UserConnected(new UserConnectionInfo(userName, IdGuid), Context.ConnectionId);
            _logger.LogInformation($"Connected user {userName} with id {IdGuid} to {nameof(ChatHub)}");
            
            await Groups.AddToGroupAsync(Context.ConnectionId, id, cancellationToken: Context.ConnectionAborted);
            await AddConnectionToGroup(IdGuid); 
            _logger.LogInformation($"Add connection {Context.ConnectionId} to group {id}");
            
            //var usersOnline = await _unitOfWork.UserRepository.GetUsersOnlineAsync(currentUsers);
            //var oneUserOnline = await _roomService.GetMemberAsync(userName);
            var oneUserOnline = new UserInfo()
            {
                Nickname = userName
            };
            
            _logger.LogInformation($"Send {HubEvents.UserOnlineInGroup} event for user id {id}");
            await Clients.Group(id).SendAsync(HubEvents.UserOnlineInGroup, oneUserOnline);
            
            var currentUsers = await _presenceTracker.GetOnlineUsers(IdGuid);
            await _roomService.UpdateMemberCountAsync(IdGuid, currentUsers.Length);
            
            var currentConnections = await _presenceTracker.GetConnectionsForUser(new UserConnectionInfo(userName, IdGuid));
            await _presenceHub.Clients.AllExcept(currentConnections).SendAsync(HubEvents.CountMemberInGroup,
                   new { Id = IdGuid, countMember = currentUsers.Length });
            
            var userIsSharing = await _shareScreenTracker.GetUserIsSharing(IdGuid);
            if(userIsSharing != null)
            {
                var currentBeginConnectionsUser = await _presenceTracker.GetConnectionsForUser(userIsSharing);
                if(currentBeginConnectionsUser.Count > 0)
                    await Clients.Clients(currentBeginConnectionsUser).SendAsync(HubEvents.OnShareScreenLastUser, new { usernameTo = userName, isShare = true });
                await Clients.Caller.SendAsync(HubEvents.OnUserIsSharing, userIsSharing.UserName);
            }
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            _logger.LogInformation($"{nameof(OnDisconnectedAsync)} ex {exception.Message}");
            var userName = ClaimsHelper.GetValue<string>((ClaimsIdentity)Context.User.Identity, OpenIddictConstants.Claims.Name);     
            var group = await RemoveConnectionFromGroup();
            var isOffline = await _presenceTracker.UserDisconnected(new UserConnectionInfo(userName, group.Id), Context.ConnectionId);

            await _shareScreenTracker.DisconnectedByUser(userName, group.Id);
            if (isOffline)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, group.Id.ToString());
                //TODO
                //var temp = await _unitOfWork.UserRepository.GetMemberAsync(userName);
                var user = new UserInfo()
                {
                    Nickname = userName,
                };
                await Clients.Group(group.Id.ToString()).SendAsync(HubEvents.UserOfflineInGroup, user);

                var currentUsers = await _presenceTracker.GetOnlineUsers(group.Id);

                await _roomService.UpdateMemberCountAsync(group.Id, currentUsers.Length, Context.ConnectionAborted);
                
                await _presenceHub.Clients.All.SendAsync(HubEvents.CountMemberInGroup,
                       new { Id = group.Id, countMember = currentUsers.Length });
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageViewModel createMessageDto)
        {
            _logger.LogInformation($"{nameof(SendMessage)}");
            var userName = ClaimsHelper.GetValue<string>((ClaimsIdentity)Context.User.Identity, OpenIddictConstants.Claims.Name);     
            
            var group = await _roomService.GetByConnectionAsync(Context.ConnectionId, Context.ConnectionAborted);

            if(group != null)
            {
                var message = new MessageViewModel()
                {
                    SenderUsername = userName,
                    SenderDisplayName = userName,
                    Content = createMessageDto.Content,
                    SendedDateTime = DateTime.UtcNow
                };
                //code here
                //send meaasge to group
                await Clients.Group(group.Id.ToString()).SendAsync("NewMessage", message);
            }
        }

        public async Task MuteMicro(bool muteMicro)
        {
            _logger.LogInformation($"{nameof(MuteMicro)}");
            var userName = ClaimsHelper.GetValue<string>((ClaimsIdentity)Context.User.Identity, OpenIddictConstants.Claims.Name);   
            var group = await _roomService.GetByConnectionAsync(Context.ConnectionId, Context.ConnectionAborted);
            if (group != null)
            {
                await Clients.Group(group.Id.ToString()).SendAsync("OnMuteMicro", new { username = userName, mute = muteMicro });
            }
            else
            {
                throw new HubException("group == null");
            }
        }

        public async Task MuteCamera(bool muteCamera)
        {
            _logger.LogInformation($"{nameof(MuteCamera)}");
            var userName = ClaimsHelper.GetValue<string>((ClaimsIdentity)Context.User.Identity, OpenIddictConstants.Claims.Name);   
            var group = await _roomService.GetByConnectionAsync(Context.ConnectionId, Context.ConnectionAborted);
            if(group != null)
            {
                await Clients.Group(group.Id.ToString()).SendAsync("OnMuteCamera", new { username = userName, mute = muteCamera });
            }
            else
            {
                throw new HubException("group == null");
            } 
        }

        public async Task ShareScreen(Guid Id, bool isShareScreen)
        {
            _logger.LogInformation($"{nameof(ShareScreen)} Id = {Id} isShareScreen:{isShareScreen}");
            var userName = ClaimsHelper.GetValue<string>((ClaimsIdentity)Context.User.Identity, OpenIddictConstants.Claims.Name);     
            if (isShareScreen)//true is doing share
            {    
                await _shareScreenTracker.UserConnectedToShareScreen(new UserConnectionInfo(userName, Id));
                await Clients.Group(Id.ToString()).SendAsync("OnUserIsSharing", userName);
            }
            else
            {
                await _shareScreenTracker.UserDisconnectedShareScreen(new UserConnectionInfo(userName, Id));
            }
            await Clients.Group(Id.ToString()).SendAsync("OnShareScreen", isShareScreen);
            //var group = await _unitOfWork.RoomRepository.GetRoomForConnection(Context.ConnectionId);
        }

        public async Task ShareScreenToUser(Guid Id, string username, bool isShare)
        {
            _logger.LogInformation($"{nameof(ShareScreen)} Id = {Id} username:{username}  isShare:{isShare}");

            var currentBeginConnectionsUser = await _presenceTracker.GetConnectionsForUser(new UserConnectionInfo(username, Id));
            if(currentBeginConnectionsUser.Count > 0)
                await Clients.Clients(currentBeginConnectionsUser).SendAsync("OnShareScreen", isShare);
        }
        private async Task<Room> RemoveConnectionFromGroup()
        {
            _logger.LogInformation($"{nameof(RemoveConnectionFromGroup)}");
            
            var group = await _roomService.GetByConnectionAsync(Context.ConnectionId, Context.ConnectionAborted);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);

            try
            {
                await _roomService.RemoveConnectionAsync(connection.ConnectionId, Context.ConnectionAborted);
                return group;
            }
            catch (Exception e)
            {
                _logger.LogInformation($"Fail to remove connection from room. Exception {e.Message}");
                throw new HubException("Fail to remove connection from room");
            }
        }
        private async Task<Room> AddConnectionToGroup(Guid Id)
        {
            _logger.LogInformation($"{nameof(AddConnectionToGroup)} Id:{Id}");
            var userName = ClaimsHelper.GetValue<string>((ClaimsIdentity)Context.User.Identity, OpenIddictConstants.Claims.Name);
            if (userName is null)
            {
                var errorMessage = $"Failed to find user name in claims";
                _logger.LogCritical(errorMessage);
                throw new HubException(errorMessage);
            }

            var group = await _roomService.GetByIdAsync(Id, Context.ConnectionAborted);
            _logger.LogInformation($"Add user {userName} with connectionId {Context.ConnectionId}");
            var connection = new Connection(Context.ConnectionId, userName);
            group.Connections.Add(connection);

            try
            {
                await _roomService.UpdateAsync(group, Context.ConnectionAborted);
                return group;
            }
            catch (Exception e)
            {
                _logger.LogInformation($"Update connections in room by id {group.Id} has throw exception: {e.Message}");
                throw new HubException("Failed to add connection to room");
            }
        }
    }
}
