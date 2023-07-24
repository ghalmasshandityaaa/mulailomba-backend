import { CheckAvailabilityEmailCommand } from './check-availability-email/check-availability-email.command';
import { CheckAvailabilityEmailHandler } from './check-availability-email/check-availability-email.handler';
import { LoginOrganizerCommand } from './login-organizer/login-organizer.command';
import { LoginOrganizerHandler } from './login-organizer/login-organizer.handler';
import { LoginUserCommand } from './login-user/login-user.command';
import { LoginUserHandler } from './login-user/login-user.handler';
import { OrganizerLogoutCommand } from './organizer-logout/organizer-logout.command';
import { OrganizerLogoutHandler } from './organizer-logout/organizer-logout.handler';
import { RefreshTokenCommand } from './refresh-token/refresh-token.command';
import { RefreshTokenHandler } from './refresh-token/refresh-token.handler';
import { RegisterOrganizerCommand } from './register-organizer/register-organizer.command';
import { RegisterOrganizerCodeHandler } from './register-organizer/register-organizer.handler';
import { RegisterUserCommand } from './register-user/register-user.command';
import { RegisterUserHandler } from './register-user/register-user.handler';
import { ResendActivationCodeCommand } from './resend-activation-code/resend-activation-code.command';
import { ResendActivationCodeHandler } from './resend-activation-code/resend-activation-code.handler';
import { VerifyUserCommand } from './verify-user/verify-user.command';
import { VerifyUserHandler } from './verify-user/verify-user.handler';

export {
  LoginUserCommand,
  LoginOrganizerCommand,
  CheckAvailabilityEmailCommand,
  RegisterUserCommand,
  ResendActivationCodeCommand,
  OrganizerLogoutCommand,
  RegisterOrganizerCommand,
  VerifyUserCommand,
  RefreshTokenCommand,
};

export const CommandHandlers = [
  LoginUserHandler,
  LoginOrganizerHandler,
  CheckAvailabilityEmailHandler,
  RegisterUserHandler,
  ResendActivationCodeHandler,
  OrganizerLogoutHandler,
  RegisterOrganizerCodeHandler,
  VerifyUserHandler,
  RefreshTokenHandler,
];
