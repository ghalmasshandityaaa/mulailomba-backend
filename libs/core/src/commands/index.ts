import { CheckAvailabilityEmailCommand } from './check-availability-email/check-availability-email.command';
import { CheckAvailabilityEmailHandler } from './check-availability-email/check-availability-email.handler';
import { LoginOrganizerCommand } from './login-organizer/login-organizer.command';
import { LoginOrganizerHandler } from './login-organizer/login-organizer.handler';
import { LoginUserCommand } from './login-user/login-user.command';
import { LoginUserHandler } from './login-user/login-user.handler';

export { LoginUserCommand, LoginOrganizerCommand, CheckAvailabilityEmailCommand };

export const CommandHandlers = [
  LoginUserHandler,
  LoginOrganizerHandler,
  CheckAvailabilityEmailHandler,
];
