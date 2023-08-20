import { FileType } from '@mulailomba/common';
import { BannerPosition, BannerStatus } from '../entities/typeorm/typeorm.banner.entity';

export interface JsonBannerProps {
  id: string;
  name: string;
  description: string;
  position: BannerPosition;
  file: FileType;
  start_date: number; // unix
  end_date: number; // unix
  status: BannerStatus;
  created_at: number; // unix
  created_by: string;
  updated_at: number; // unix
  updated_by: string;
}
