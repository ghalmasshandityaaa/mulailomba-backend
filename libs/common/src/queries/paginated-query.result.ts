import { Expose } from 'class-transformer';
import { PaginatedCollection } from '../interfaces';

class PaginatedQueryResultMetadata {
  constructor(page: number, pageSize: number, totalCount: number) {
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.totalPage = Math.ceil(this.totalCount / this.pageSize);
  }

  readonly page: number;

  @Expose({ name: 'page_size' })
  readonly pageSize: number;

  @Expose({ name: 'total_count' })
  readonly totalCount: number;

  @Expose({ name: 'total_page' })
  readonly totalPage: number;
}

export abstract class PaginatedQueryResult<T> {
  @Expose({ name: '_metadata' })
  readonly metadata: PaginatedQueryResultMetadata;

  constructor(collection: PaginatedCollection<T>) {
    this.metadata = new PaginatedQueryResultMetadata(
      collection.metadata.page,
      collection.metadata.pageSize,
      collection.metadata.totalCount,
    );
  }
}
