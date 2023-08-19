export interface ICollection<T> {
  readonly data: T[];
}

export type PaginatedCollectionMetadata = {
  readonly page: number;
  readonly pageSize: number;
  readonly totalCount: number;
  readonly lastData?: string;
};

export type PaginatedCollection<T> = ICollection<T> & {
  metadata: PaginatedCollectionMetadata;
};

export type PaginatedCollectionWithHeader<Item, Header> = PaginatedCollection<Item> & Header;
