import { BannerQueryModel, JsonBannerProps } from '@mulailomba/banner/interfaces';
import { JsonBannerSerializer } from '@mulailomba/banner/serializers';

export class FindHomepagesResult {
  readonly banners: JsonBannerProps[];

  constructor(collections: BannerQueryModel[]) {
    this.banners = collections.map((collection) => JsonBannerSerializer.serialize(collection));
  }
}
