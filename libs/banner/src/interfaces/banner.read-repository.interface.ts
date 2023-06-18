import { BannerQueryModel } from './banner.interface';

export interface IBannerReadRepository {
  findAll(): Promise<BannerQueryModel[]>;
}
