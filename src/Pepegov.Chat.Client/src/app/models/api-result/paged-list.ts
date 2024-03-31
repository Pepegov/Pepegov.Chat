export class PagedList<T>{
    indexFrom: number;
    pageIndex: number;
    pageSize: number
    totalPages: number;
    items: Array<T>;
    hasPreviousPage: boolean;
    hasNextPage: boolean
}
