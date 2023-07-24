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
  refreshTokens(refreshToken: string): Promise<string>;
  checkAvailabilityEmail(emailAddress: string): Promise<void>;
  sendActivationCode(emailAddress: string): Promise<void>;
}
