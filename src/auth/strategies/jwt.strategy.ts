import { IIdentity, RolePermission } from '@aksesaja/common';
import { USER_SERVICE } from '@aksesaja/user/constants';
import { IUserService } from '@aksesaja/user/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthError } from '../errors';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<IIdentity> {
    const identity: IIdentity = {
      id: payload.sub,
      role: payload.role,
      isActive: false,
    };

    if (identity.role === RolePermission.USER) {
      const user = await this.userService.findById(identity.id);
      if (!user) throw new AuthError.InvalidCredentials();

      identity.isActive = user.isActive;
    } else if (identity.role === RolePermission.ORGANIZER) {
    } else {
      throw new AuthError.InvalidCredentials();
    }

    if (!identity.isActive) throw new AuthError.AlreadyDeactivated();

    return identity;
  }
}
