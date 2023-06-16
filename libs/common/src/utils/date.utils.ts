import { DateTime } from 'luxon';

export class DateUtils {
  /**
   *
   * @param date
   * @returns
   */
  public static toUnix = (date: Date): number => {
    return Math.round(date.getTime() / 1000);
  };

  /**
   *
   * @param date
   * @param format
   * @returns
   */
  public static toFormat = (date: Date, format: string): string => {
    const value = DateTime.fromJSDate(date);
    return value.toFormat(format);
  };
}
