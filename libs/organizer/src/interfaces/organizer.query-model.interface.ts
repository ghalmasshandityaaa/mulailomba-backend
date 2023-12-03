export interface OrganizerQueryModel {
  id: string;
  name: string;
  username: string;
  profile?: string;
  background?: string;
  emailAddress: string;
  password: string;
  isLocked: boolean;
  isActive: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  logoutAt?: Date;
  userId: string;
}
