import { IFilterableQuery } from '@mulailomba/common';
import { BannerQueryModel } from './banner.query-model.interface';

export interface IBannerReadRepository {
  findAll(params: IFilterableQuery): Promise<BannerQueryModel[]>;
}
