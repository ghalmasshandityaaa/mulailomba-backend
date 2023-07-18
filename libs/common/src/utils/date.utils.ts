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

  /**
   *
   * @param data
   * @param key
   * @returns
   */
  public static checkOverlap = (data: any[], key: { start: string; end: string }): boolean => {
    for (let i = 0; i < data.length - 1; i++) {
      const currentEndDate = new Date(data[i][key.end]);
      const nextStartDate = new Date(data[i + 1][key.start]);

      if (currentEndDate >= nextStartDate) return true;
    }
    return false;
  };
}
