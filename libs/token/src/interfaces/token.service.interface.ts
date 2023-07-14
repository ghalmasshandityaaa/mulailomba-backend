import { IIdentity } from '@mulailomba/common';

export interface ITokenService {
  validate(token: string): IIdentity;
  generateToken(identity: IIdentity): Promise<{ accessToken: string; refreshToken: string }>;
  generateAccessToken(identity: IIdentity): string;
  generateRefreshToken(identity: IIdentity): string;
}
