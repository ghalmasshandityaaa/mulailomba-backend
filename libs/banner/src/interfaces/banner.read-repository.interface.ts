import { IFilterableQuery } from '@mulailomba/common';
import { BannerQueryModel } from './banner.interface';

export interface IBannerReadRepository {
  findAll(params: IFilterableQuery): Promise<BannerQueryModel[]>;
}
