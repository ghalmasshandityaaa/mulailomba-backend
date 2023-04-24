import { UserQueryModel } from './user.query-model.interface';

export interface IUserService {
  findById(id: string): Promise<UserQueryModel | undefined>;
  findByEmail(emailAddress: string): Promise<UserQueryModel | undefined>;
}
