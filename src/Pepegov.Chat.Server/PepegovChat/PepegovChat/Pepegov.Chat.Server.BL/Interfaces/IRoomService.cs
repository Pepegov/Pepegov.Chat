using Pepegov.UnitOfWork.Entityes;
using Pepegov.Chat.Server.DAL.Models;

namespace Pepegov.Chat.Server.BL.Interfaces;

public interface IRoomService
{
    public Task InsertAsync(Room room, CancellationToken cancellationToken = default);
    public Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    public Task RemoveConnectionAsync(string connectionId, CancellationToken cancellationToken = default);
    public Task UpdateAsync(Room room, CancellationToken cancellationToken = default);
    public Task<Room> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    public Task<Room> GetByConnectionAsync(string connectionId, CancellationToken cancellationToken = default);
    public Task<PagedList<Room>> GetPagedListAsync(int pageIndex, int pageSize, CancellationToken cancellationToken = default);

    public Task UpdateMemberCountAsync(Guid roomId, int memberCount, CancellationToken cancellationToken = default);
}