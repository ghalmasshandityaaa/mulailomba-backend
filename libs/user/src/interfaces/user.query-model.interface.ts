export interface UserQueryModel {
  id: string;
  fullName: string;
  phone: string;
  emailAddress: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
