import {
  Cookies,
  CookieUtils,
  FileUtils,
  Identity,
  IIdentity,
  RolePermission,
  Roles,
  UploadedFileType,
} from '@mulailomba/common';
import { JwtAuthGuard, RoleGuard } from '@mulailomba/common/guards';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  LoginOrganizerCommand,
  LoginUserCommand,
  RefreshTokenCommand,
  RegisterOrganizerCommand,
  RegisterUserCommand,
  ResendActivationCodeCommand,
} from '../commands';
import { CheckAvailabilityEmailCommand } from '../commands/check-availability-email/check-availability-email.command';
import { OrganizerLogoutCommand } from '../commands/organizer-logout/organizer-logout.command';
import { VerifyUserCommand } from '../commands/verify-user/verify-user.command';
import {
  CheckAvailabilityEmailBodyDTO,
  OrganizerLoginBodyDTO,
  OrganizerRegisterBodyDTO,
  UserLoginBodyDTO,
  UserRegisterBodyDTO,
  VerifyAccountBodyDTO,
} from '../dtos';
import { AuthError } from '../errors';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Res({ passthrough: true }) res: Response, @Body() body: UserLoginBodyDTO) {
    const command = new LoginUserCommand({ ...body });
    const token = await this.commandBus.execute(command);

    CookieUtils.set(res, 'refresh_token', token.refreshToken);

    return token;
  }

  @Post('organizer/login')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.USER)
  @HttpCode(HttpStatus.OK)
  async loginOrganizer(
    @Res({ passthrough: true }) res: Response,
    @Body() body: OrganizerLoginBodyDTO,
    @Identity() identity: IIdentity,
    @Cookies('organizer_refresh_token') organizerRefreshToken: any,
  ) {
    if (organizerRefreshToken) throw new AuthError.SignedIn();

    const command = new LoginOrganizerCommand({ ...body, userId: identity.id });
    const token = await this.commandBus.execute(command);

    CookieUtils.set(res, 'organizer_refresh_token', token.refreshToken);

    return token;
  }

  @Post('user/register')
  @HttpCode(HttpStatus.OK)
  async registerUser(
    @Res({ passthrough: true }) res: Response,
    @Cookies('email') emailAddress: any,
    @Body() body: UserRegisterBodyDTO,
  ) {
    if (!emailAddress) throw new AuthError.ForbiddenAccess();
    const command = new RegisterUserCommand({ ...body, phone: body.phoneNumber, emailAddress });
    const tokens = await this.commandBus.execute(command);

    CookieUtils.delete(res, ['email']);
    CookieUtils.set(res, 'refresh_token', tokens.refreshToken);

    return tokens;
  }

  @Post('organizer/register')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profile', maxCount: 1 },
        { name: 'background', maxCount: 1 },
      ],
      {
        fileFilter: FileUtils.filterCallback({ type: 'IMAGES' }),
        limits: { fileSize: 10000000 }, // 10mb
      },
    ),
  )
  @Roles(RolePermission.USER)
  async registerOrganizer(
    @Res({ passthrough: true }) res: Response,
    @Cookies('organizer_refresh_token') organizerRefreshToken: any,
    @Body() body: OrganizerRegisterBodyDTO,
    @Identity() identity: IIdentity,
    @UploadedFiles() files: { profile?: UploadedFileType[]; background?: UploadedFileType[] },
  ) {
    const command = new RegisterOrganizerCommand({
      ...body,
      isLocked: body.isLocked === 'true',
      userId: identity.id,
      profile: files.profile ? files.profile[0] : undefined,
      background: files.background ? files.background[0] : undefined,
    });
    const result = await this.commandBus.execute(command);

    if (organizerRefreshToken) {
      CookieUtils.set(res, 'organizer_refresh_token', result.refreshToken);
    }

    return result;
  }

  @Post('user/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.USER)
  async logoutUser(@Res({ passthrough: true }) res: Response) {
    CookieUtils.delete(res, ['refresh_token']);
  }

  @Post('organizer/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async logoutOrganizer(
    @Res({ passthrough: true }) res: Response,
    @Identity() identity: IIdentity,
  ) {
    const command = new OrganizerLogoutCommand({ id: identity.id });
    await this.commandBus.execute(command);

    CookieUtils.delete(res, ['organizer_refresh_token']);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Cookies('refresh_token') refreshToken: any,
    @Cookies('organizer_refresh_token') organizerRefreshToken: any,
    @Headers('X-Resource-Type') type: string,
  ) {
    const token = type?.toUpperCase() === 'ORGANIZER' ? organizerRefreshToken : refreshToken;
    if (!token) throw new AuthError.ForbiddenAccess();

    const command = new RefreshTokenCommand({ token });
    return await this.commandBus.execute(command);
  }

  @Post('check-availability-email')
  @HttpCode(HttpStatus.OK)
  async checkAvailabilityEmail(
    @Res({ passthrough: true }) res: Response,
    @Body() body: CheckAvailabilityEmailBodyDTO,
  ) {
    const command = new CheckAvailabilityEmailCommand({ ...body });
    await this.commandBus.execute(command);
    CookieUtils.set(res, 'email', body.emailAddress);
    return;
  }

  @Post('user/verify')
  @HttpCode(HttpStatus.OK)
  async verifyActivationCode(@Body() body: VerifyAccountBodyDTO) {
    const command = new VerifyUserCommand({ ...body });
    return await this.commandBus.execute(command);
  }

  @Post('resend-activation-code')
  @HttpCode(HttpStatus.OK)
  async resendActivationCode(@Cookies('email') email: any) {
    if (!email) throw new AuthError.ForbiddenAccess();

    const command = new ResendActivationCodeCommand({ email });
    return await this.commandBus.execute(command);
  }
}
