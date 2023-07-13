import { IIdentity } from '@mulailomba/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '../interfaces';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(identity: IIdentity): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      Promise.resolve(this.generateAccessToken(identity)),
      Promise.resolve(this.generateRefreshToken(identity)),
    ]);

    return { accessToken, refreshToken };
  }

  generateAccessToken(identity: IIdentity): string {
    const token = this.jwtService.sign(
      { sub: identity.id, role: identity.role, isActive: identity.isActive },
      { expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME') },
    );

    return token;
  }

  generateRefreshToken(identity: IIdentity): string {
    const token = this.jwtService.sign(
      { sub: identity.id, role: identity.role, isActive: identity.isActive },
      { expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME') },
    );

    return token;
  }
}
