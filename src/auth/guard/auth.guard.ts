import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthError } from '../errors';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err: any, user: any, info: any, _: any) {
    if (err) this.handleError(err);
    else if (info) this.handleError(info);
    else if (!user) throw new AuthError.InvalidCredentials();

    return user;
  }

  private handleError(err: any): void {
    if (err?.name === 'TokenExpiredError') {
      throw new AuthError.ExpiredToken();
    } else if (err?.name === 'AlreadyDeactivated') {
      throw new AuthError.AlreadyDeactivated();
    } else {
      throw new AuthError.InvalidCredentials();
    }
  }
}
