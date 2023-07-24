import { CheckAvailabilityEmailCommand } from './check-availability-email/check-availability-email.command';
import { CheckAvailabilityEmailHandler } from './check-availability-email/check-availability-email.handler';
import { LoginOrganizerCommand } from './login-organizer/login-organizer.command';
import { LoginOrganizerHandler } from './login-organizer/login-organizer.handler';
import { LoginUserCommand } from './login-user/login-user.command';
import { LoginUserHandler } from './login-user/login-user.handler';
import { RegisterUserCommand } from './register-user/register-user.command';
import { RegisterUserHandler } from './register-user/register-user.handler';

export {
  LoginUserCommand,
  LoginOrganizerCommand,
  CheckAvailabilityEmailCommand,
  RegisterUserCommand,
};

export const CommandHandlers = [
  LoginUserHandler,
  LoginOrganizerHandler,
  CheckAvailabilityEmailHandler,
  RegisterUserHandler,
];
