import { CookieOptions, Request, Response } from 'express';

const SECURE_COOKIES = process.env.NODE_ENV === 'production';
const SAME_SITE_COOKIES = SECURE_COOKIES ? 'none' : 'lax';
const COOKIES_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: SECURE_COOKIES,
  sameSite: SAME_SITE_COOKIES,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  domain: SECURE_COOKIES ? 'aksesaja.site' : 'localhost',
};

export class CookieUtils {
  /**
   *
   * @param name
   * @param value
   */
  public static set = (res: Response, name: string, value = ''): void => {
    res.cookie(name, value, COOKIES_OPTIONS);
  };

  /**
   *
   * @param name
   */
  public static delete = (res: Response, name: string): void => {
    res.clearCookie(name, {
      ...COOKIES_OPTIONS,
      maxAge: 0,
    });
  };

  /**
   * @param Request
   * @param Response
   */
  public static clear = (req: Request, res: Response): void => {
    const cookies: any = req.cookies;

    for (const cookie in cookies) {
      res.clearCookie(cookie, {
        ...COOKIES_OPTIONS,
        maxAge: 0,
      });
    }
  };
}
