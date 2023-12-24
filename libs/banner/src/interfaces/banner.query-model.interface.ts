import { BannerPosition, BannerStatus } from '../entities/typeorm/typeorm.banner.entity';

export interface BannerQueryModel {
  id: string;
  name: string;
  description: string;
  position: BannerPosition;
  file: string;
  startDate: Date;
  endDate: Date;
  status: BannerStatus;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}
