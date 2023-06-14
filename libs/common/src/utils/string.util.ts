import { genSalt, hash as toHash } from 'bcrypt';

export class StringUtils {
  /**
   *
   * @param text
   * @returns
   */
  public static async hash(text: string): Promise<string> {
    const SALT_ROUND = 10;
    const salt = await genSalt(SALT_ROUND);
    const hash = await toHash(text, salt);

    return hash;
  }
}
