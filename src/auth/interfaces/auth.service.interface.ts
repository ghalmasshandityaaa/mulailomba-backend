import { IIdentity } from '@aksesaja/common';

export type ILoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export interface IAuthService {
  validateUser(email: string, password: string): Promise<IIdentity>;
  validate(identity: IIdentity): Promise<boolean>;
  generateTokens(identity: IIdentity): Promise<ILoginResponse>;
  refreshTokens(refreshToken: string): Promise<ILoginResponse>;
  checkAvailabilityEmail(emailAddress: string): Promise<void>;
}
