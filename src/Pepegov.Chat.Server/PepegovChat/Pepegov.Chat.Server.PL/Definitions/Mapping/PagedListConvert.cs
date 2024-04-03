using AutoMapper;
using Pepegov.UnitOfWork.Entityes;
using Pepegov.UnitOfWork.EntityFramework.Repository;

namespace Pepegov.Chat.Server.PL.Definitions.Mapping;

public class PagedListMappingProfile : Profile
{
    public PagedListMappingProfile()
    {
        CreateMap(typeof(PagedList<>), typeof(PagedList<>));
        CreateMap(typeof(IPagedList<>), typeof(IPagedList<>));
        CreateMap(typeof(IPagedList<>), typeof(PagedList<>));
    }
}

public class IPagedListConvert<TMapFrom, TMapTo> : ITypeConverter<IPagedList<TMapFrom>, IPagedList<TMapTo>>
{
    public IPagedList<TMapTo> Convert(IPagedList<TMapFrom> source, IPagedList<TMapTo> destination,
        ResolutionContext context) =>
        source == null
            ? PagedList.Empty<TMapTo>()
            : PagedList.From(source, items => context.Mapper.Map<IEnumerable<TMapTo>>(items));
}

public class PagedListConvert<TMapFrom, TMapTo> : ITypeConverter<PagedList<TMapFrom>, PagedList<TMapTo>>
{
    public PagedList<TMapTo> Convert(PagedList<TMapFrom> source, PagedList<TMapTo> destination,
        ResolutionContext context) =>
        source == null
            ? (PagedList<TMapTo>)PagedList.Empty<TMapTo>()
            : (PagedList<TMapTo>)PagedList.From(source, items => context.Mapper.Map<IEnumerable<TMapTo>>(items));
}