type PaginationParams = {
  page: number;
  pageSize: number;
  offset: number;
};

export abstract class BaseReadRepository {
  protected getPaginationParams(page?: number, pageSize?: number): PaginationParams {
    const _page = page && page > 0 ? page : 1;
    const _size = pageSize && pageSize > 0 ? pageSize : 10;

    return {
      page: _page,
      pageSize: _size,
      offset: _page > 1 ? (_page - 1) * _size : 0,
    };
  }
}
