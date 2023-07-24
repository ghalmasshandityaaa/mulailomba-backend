import { LoginUserCommand } from './login-user/login-user.command';
import { LoginUserHandler } from './login-user/login-user.handler';

export { LoginUserCommand };

export const CommandHandlers = [LoginUserHandler];
