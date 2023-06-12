import { IIdentity, RolePermission } from '@mulailomba/common';
import { ORGANIZER_SERVICE } from '@mulailomba/organizer/constants';
import { IOrganizerService } from '@mulailomba/organizer/interfaces';
import { USER_SERVICE } from '@mulailomba/user/constants';
import { IUserService } from '@mulailomba/user/interfaces';
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
    @Inject(ORGANIZER_SERVICE)
    private readonly organizerService: IOrganizerService,
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
      isActive: payload.isActive,
    };

    if (identity.role === RolePermission.USER) {
      const user = await this.userService.findById(identity.id);
      if (!user) throw new AuthError.InvalidCredentials();

      identity.isActive = user.isActive;
    } else if (identity.role === RolePermission.ORGANIZER) {
      const organizer = await this.organizerService.findById(identity.id);
      if (!organizer) throw new AuthError.InvalidCredentials();

      identity.isActive = organizer.isActive;
    } else {
      throw new AuthError.InvalidCredentials();
    }

    if (!identity.isActive) throw new AuthError.AlreadyDeactivated();

    return identity;
  }
}
