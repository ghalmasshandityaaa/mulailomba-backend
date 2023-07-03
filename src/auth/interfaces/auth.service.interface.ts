import { IIdentity } from '@mulailomba/common';
import { OrganizerQueryModel } from '@mulailomba/organizer/interfaces';
import { UserQueryModel } from '@mulailomba/user/interfaces';

export type ILoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export interface IAuthService {
  validateUser(email: string, password: string): Promise<UserQueryModel>;
  validateOrganizer(
    organizerId: string,
    userId: string,
    password?: string,
  ): Promise<OrganizerQueryModel>;
  validate(identity: IIdentity): Promise<boolean>;
  generateTokens(identity: IIdentity): Promise<ILoginResponse>;
  refreshTokens(refreshToken: string): Promise<ILoginResponse>;
  checkAvailabilityEmail(emailAddress: string): Promise<void>;
  sendActivationCode(emailAddress: string): Promise<void>;
}
