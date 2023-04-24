import { IIdentity, RolePermission } from '@aksesaja/common';
import { USER_SERVICE } from '@aksesaja/user/constants';
import { UserError } from '@aksesaja/user/errors';
import { IUserService } from '@aksesaja/user/interfaces';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AuthError } from '../errors';
import { IAuthService, ILoginResponse } from '../interfaces';

export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
  ) {}

  async validateUser(emailAddress: string, password: string): Promise<IIdentity> {
    const user = await this.userService.findByEmail(emailAddress);
    if (!user) throw new UserError.NotFound();

    const valid = await this.comparePassword(password, user.password);
    if (!valid) throw new AuthError.InvalidCredentials();
    else if (!user.isActive) throw new UserError.UserAlreadyDeactivated();

    return { id: user.id, role: RolePermission.USER, isActive: user.isActive };
  }

  async validate(identity: IIdentity): Promise<boolean> {
    let valid = false;

    if (identity.role === RolePermission.USER) {
      const user = await this.userService.findById(identity.id);
      if (user) valid = true;
    } else if (identity.role === RolePermission.ORGANIZER) {
      // TODO: validate identity organizer
    }

    return valid;
  }

  async generateTokens(identity: IIdentity, onlyAccessToken = false): Promise<ILoginResponse> {
    let accessToken: string;
    let refreshToken: string | undefined;

    if (onlyAccessToken) {
      accessToken = this.jwtService.sign(
        { sub: identity.id, role: identity.role, isActive: identity.isActive },
        { expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME') },
      );
    } else {
      [accessToken, refreshToken] = await Promise.all([
        Promise.resolve(
          this.jwtService.sign(
            { sub: identity.id, role: identity.role, isActive: identity.isActive },
            { expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME') },
          ),
        ),
        Promise.resolve(
          this.jwtService.sign(
            { sub: identity.id, role: identity.role, isActive: identity.isActive },
            { expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME') },
          ),
        ),
      ]);
    }

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<ILoginResponse> {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const identity: IIdentity = {
        id: decoded.sub,
        role: decoded.role,
        isActive: decoded.isActive,
      };

      const valid = await this.validate(identity);
      if (!valid) throw new AuthError.InvalidCredentials();

      const tokens = await this.generateTokens(identity, true);
      return tokens;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  /** Utility Method */
  // private async hashPassword(password: string): Promise<string> {
  //   const saltRounds = 10;
  //   const salt = await genSalt(saltRounds);
  //   return await hash(password, salt);
  // }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}
