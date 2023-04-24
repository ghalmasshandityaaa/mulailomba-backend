export interface IIdentity {
  id: string;
  role: RolePermission;
  isActive: boolean;
}

export enum RolePermission {
  USER = 'USER',
  ORGANIZER = 'ORGANIZER',
}
