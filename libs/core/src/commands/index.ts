import { LoginOrganizerCommand } from './login-organizer/login-organizer.command';
import { LoginOrganizerHandler } from './login-organizer/login-organizer.handler';
import { LoginUserCommand } from './login-user/login-user.command';
import { LoginUserHandler } from './login-user/login-user.handler';

export { LoginUserCommand, LoginOrganizerCommand };

export const CommandHandlers = [LoginUserHandler, LoginOrganizerHandler];
