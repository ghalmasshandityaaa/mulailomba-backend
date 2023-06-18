import { BannerQueryModel } from '@mulailomba/banner/interfaces';

export class FindHomepagesResult {
  readonly banners: BannerQueryModel[];

  constructor(collections: BannerQueryModel[]) {
    this.banners = collections;
  }
}
