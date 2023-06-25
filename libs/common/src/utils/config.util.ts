import * as dotenv from 'dotenv';
dotenv.config();

export class ConfigUtils {
  /**
   *
   * @param key
   * @returns
   */
  public static get(key: string): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return process.env[key]!;
  }

  /**
   *
   * @param key
   * @returns
   */
  public static getNumber(key: string): number {
    return Number(process.env[key]);
  }

  /**
   *
   * @param key
   * @returns
   */
  public static getBoolean(key: string): boolean {
    return process.env[key] === 'true';
  }

  /**
   *
   * @param key
   * @returns
   */
  public static getMultiLine(key: string) {
    try {
      const getLine = process.env[key];
      return getLine ? getLine.replace(/\\n/g, '\n') : null;
    } catch (e) {
      return null;
    }
  }
}
