export interface OrganizerQueryModel {
  id: string;
  name: string;
  profile: string;
  background: string;
  password: string;
  isLocked: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
