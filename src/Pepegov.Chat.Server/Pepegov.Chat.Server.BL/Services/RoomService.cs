using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pepegov.Chat.Server.BL.Interfaces;
using Pepegov.MicroserviceFramework.Data.Exceptions;
using Pepegov.MicroserviceFramework.Exceptions;
using Pepegov.UnitOfWork;
using Pepegov.UnitOfWork.Entityes;
using Pepegov.UnitOfWork.EntityFramework;
using Pepegov.Chat.Server.DAL.Models;

namespace Pepegov.Chat.Server.BL.Services;

public class RoomService : IRoomService
{
    private readonly ILogger<RoomService> _logger;
    private readonly IUnitOfWorkEntityFrameworkInstance _unitOfWorkInstance;

    public RoomService(ILogger<RoomService> logger, IUnitOfWorkManager unitOfWorkManager)
    {
        _logger = logger;
        _unitOfWorkInstance = unitOfWorkManager.GetInstance<IUnitOfWorkEntityFrameworkInstance>();
    }

    public async Task InsertAsync(Room room, CancellationToken cancellationToken = default)
    {
        var roomRepository = _unitOfWorkInstance.GetRepository<Room>();
        await roomRepository.InsertAsync(room, cancellationToken);
        await _unitOfWorkInstance.SaveChangesAsync(cancellationToken);

        if (!_unitOfWorkInstance.LastSaveChangesResult.IsOk)
        {
            var errorMessage = $"Failed to save room entity. Exception: {_unitOfWorkInstance.LastSaveChangesResult.Exception?.Message}";
            _logger.LogError(errorMessage);
            throw new MicroserviceDatabaseException(errorMessage);
        }
        _logger.LogInformation($"Room with data Name:{room.Name} ID:{room.Id} MemberCount:{room.MemberCount} successful saved to db");
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var roomRepository = _unitOfWorkInstance.GetRepository<Room>();
        if (!await roomRepository.ExistsAsync(selector: x => x.Id == id, cancellationToken: cancellationToken))
        {
            throw new MicroserviceNotFoundException();
        }
        
        roomRepository.Delete(id);
        await _unitOfWorkInstance.SaveChangesAsync(cancellationToken);
        
        if (!_unitOfWorkInstance.LastSaveChangesResult.IsOk)
        {
            var errorMessage = $"Failed to delete room by id {id}. Exception: {_unitOfWorkInstance.LastSaveChangesResult.Exception?.Message}";
            _logger.LogError(errorMessage);
            throw new MicroserviceDatabaseException(errorMessage);
        }
        _logger.LogInformation($"Room id {id} successful deleted");
    }

    public async Task RemoveConnectionAsync(string connectionId, CancellationToken cancellationToken = default)
    {
        var connectionRepository = _unitOfWorkInstance.GetRepository<Connection>();
        connectionRepository.Delete(connectionId);
        await _unitOfWorkInstance.SaveChangesAsync(cancellationToken);
     
        if (!_unitOfWorkInstance.LastSaveChangesResult.IsOk)
        {
            var errorMessage = $"Failed to delete connection by id {connectionId}. Exception: {_unitOfWorkInstance.LastSaveChangesResult.Exception?.Message}";
            _logger.LogError(errorMessage);
            throw new MicroserviceDatabaseException(errorMessage);
        }
    }

    public async Task UpdateAsync(Room room, CancellationToken cancellationToken = default)
    {
        await _unitOfWorkInstance.BeginTransactionAsync(cancellationToken);
        var roomRepository = _unitOfWorkInstance.GetRepository<Room>();

        try
        {
            roomRepository.Update(room);
            await _unitOfWorkInstance.SaveChangesAsync(cancellationToken);
        }
        catch (Exception e)
        {
            _logger.LogError($"UpdateAsync has throw exception: {e.Message}");
            await _unitOfWorkInstance.RollbackTransactionAsync(cancellationToken);
        }
        
        if (!_unitOfWorkInstance.LastSaveChangesResult.IsOk)
        {
            var errorMessage = $"Failed to update room by id {room.Id}. Exception: {_unitOfWorkInstance.LastSaveChangesResult.Exception?.Message}";
            _logger.LogError(errorMessage);
            await _unitOfWorkInstance.RollbackTransactionAsync(cancellationToken);
        }
        
        await _unitOfWorkInstance.CommitTransactionAsync(cancellationToken);
    }

    public async Task<Room> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var roomRepository = _unitOfWorkInstance.GetRepository<Room>();
        var entity =await roomRepository.GetFirstOrDefaultAsync(
            predicate: x => x.Id == id, disableTracking: false, 
            cancellationToken: cancellationToken);
        if (entity is null)
        {
            var notFoundMessage = $"Room by id {id} not found";
            _logger.LogInformation(notFoundMessage);
            throw new MicroserviceNotFoundException(notFoundMessage);
        }

        return entity;
    }

    public async Task<Room> GetByConnectionAsync(string connectionId, CancellationToken cancellationToken = default)
    {
        var roomRepository = _unitOfWorkInstance.GetRepository<Room>();
        var entity= await roomRepository.GetFirstOrDefaultAsync(
            include: x => x.Include(i => i.Connections),
            predicate: x => x.Connections.Any(c => c.ConnectionId == connectionId), 
            cancellationToken: cancellationToken);

        if (entity is null)
        {
            var notFoundMessage = $"Room by connectionId = {connectionId} in not found";
            _logger.LogInformation(notFoundMessage);
            throw new MicroserviceNotFoundException(notFoundMessage);
        }

        return entity;
    }

    public async Task<PagedList<Room>> GetPagedListAsync(int pageIndex, int pageSize, CancellationToken cancellationToken = default)
    {
        var roomRepository = _unitOfWorkInstance.GetRepository<Room>();
        return (PagedList<Room>)await roomRepository.GetPagedListAsync(pageIndex: pageIndex, pageSize: pageSize,
            cancellationToken: cancellationToken);
    }

    public async Task UpdateMemberCountAsync(Guid Id, int memberCount, CancellationToken cancellationToken = default)
    {
        var room = await GetByIdAsync(Id, cancellationToken);
        room.MemberCount = memberCount;
        await UpdateAsync(room, cancellationToken);
    }
}