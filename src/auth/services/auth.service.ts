import { GenerateRandomCode, IIdentity, RolePermission } from '@aksesaja/common';
import { IMailerService } from '@aksesaja/mailer/interfaces';
import { MAILER_SERVICE } from '@aksesaja/mailer/mailer.constant';
import { ORGANIZER_SERVICE } from '@aksesaja/organizer/constants';
import { OrganizerError } from '@aksesaja/organizer/errors';
import { IOrganizerService } from '@aksesaja/organizer/interfaces';
import { USER_SERVICE } from '@aksesaja/user/constants';
import { UserError } from '@aksesaja/user/errors';
import { IUserService } from '@aksesaja/user/interfaces';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ACTIVATION_CODE_SERVICE } from '../constants';
import { AuthError } from '../errors';
import { IActivationCodeService, IAuthService, ILoginResponse } from '../interfaces';

export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
    @Inject(MAILER_SERVICE)
    private readonly mailerService: IMailerService,
    @Inject(ACTIVATION_CODE_SERVICE)
    private readonly activationCodeService: IActivationCodeService,
    @Inject(ORGANIZER_SERVICE)
    private readonly organizerService: IOrganizerService,
  ) {}

  async validateUser(emailAddress: string, password: string): Promise<IIdentity> {
    const user = await this.userService.findByEmail(emailAddress);
    if (!user) throw new UserError.NotFound();

    const valid = await this.comparePassword(password, user.password);
    if (!valid) throw new AuthError.InvalidCredentials();
    else if (!user.isActive) throw new UserError.AlreadyDeactivated();

    return { id: user.id, role: RolePermission.USER, isActive: user.isActive };
  }

  async validateOrganizer(
    organizerId: string,
    userId: string,
    password?: string,
  ): Promise<IIdentity> {
    const organizer = await this.organizerService.findById(organizerId, userId);
    if (!organizer) throw new OrganizerError.NotFound();

    if (organizer.isLocked) {
      if (!password) throw new AuthError.InvalidCredentials();
      const valid = await this.comparePassword(password, organizer.password);
      if (!valid) throw new AuthError.InvalidCredentials();
    }

    if (!organizer.isActive) throw new OrganizerError.AlreadyDeactivated();

    return { id: organizer.id, role: RolePermission.ORGANIZER, isActive: organizer.isActive };
  }

  async validate(identity: IIdentity): Promise<boolean> {
    let valid = false;

    if (identity.role === RolePermission.USER) {
      const user = await this.userService.findById(identity.id);
      if (user) valid = true;
    } else if (identity.role === RolePermission.ORGANIZER) {
      const organizer = await this.organizerService.findById(identity.id);
      if (organizer) valid = true;
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

  async checkAvailabilityEmail(emailAddress: string): Promise<void> {
    const user = await this.userService.findByEmail(emailAddress);
    if (user) throw new UserError.AlreadyExist();

    await this.sendActivationCode(emailAddress);
  }

  async sendActivationCode(emailAddress: string): Promise<void> {
    const activationCode = GenerateRandomCode(6);
    await this.activationCodeService.create(emailAddress, activationCode);
    await this.mailerService.sendActivationCode(
      { recipients: [emailAddress] },
      { activationCode: activationCode.split('') },
    );
  }

  /** Utility Method */
  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}
