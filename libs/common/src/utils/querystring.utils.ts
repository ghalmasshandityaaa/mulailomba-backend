import { keyBy, merge, values } from 'lodash';
import { DateTime } from 'luxon';
import {
  EqualsFilterCondition,
  FilterCondition,
  InFilterCondition,
  SearchCondition,
  SortCondition,
} from '../interfaces';

export class QueryStringUtils {
  public static parseSortCondition(value: string): SortCondition[] {
    // ex: period|asc|priority
    // [field]|[direction]|[priority] separated by ,
    const conditions: SortCondition[] = [];
    if (value) {
      const sortings = value.split(',');
      for (const sort of sortings) {
        try {
          const parts = sort.split('|');
          conditions.push({
            target: parts[0],
            direction: parts[1].toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
          });
        } catch (err) {
          // do nothing
        }
      }
    }
    return conditions;
  }

  public static parseSearchCondition(value: string): SearchCondition[] {
    // ex: item:contains(472),route:eql(E4)
    const conditions: SearchCondition[] = [];
    if (value) {
      const searches = value.split(',');
      for (const search of searches) {
        const parts = search.split(':');
        const matches = parts[1].match(/(contains|eql)\((\S*)\)/);
        if (matches) {
          const op = matches[1].toLowerCase();
          const value = matches[2];

          try {
            conditions.push({
              target: parts[0],
              contains: op === 'contains' ? value : undefined,
              equals: op === 'eql' ? value : undefined,
            });
          } catch (err) {
            // do nothing
          }
        }
      }
    }
    return conditions;
  }

  public static parseLegacySearchCondition(value: string): SearchCondition[] {
    // ex: date:value1,status:draft,customer:MZ01
    const conditions: SearchCondition[] = [];
    if (value) {
      const searches = value.split(',');
      for (const search of searches) {
        const parts = search.split(':');

        try {
          conditions.push({
            target: parts[0],
            contains: parts[1],
            equals: undefined,
          });
        } catch (err) {
          // do nothing
        }
      }
    }
    return conditions;
  }

  public static parseFilterCondition(value: string): FilterCondition<any>[] {
    // ex: date:between(value1|value2),status:in(draft|submitted),customer:eql(MZ01)
    const conditions: FilterCondition<any>[] = [];
    if (value) {
      const filters = value.split(',');
      for (const filter of filters) {
        const parts = filter.split(':');
        const matches = parts[1].match(/(between|in|eql)\((\S*)\)/);
        if (matches) {
          const op = matches[1].toLowerCase();
          const values: string | string[] =
            matches[2].indexOf('|') > 0 ? matches[2].split('|') : matches[2];

          try {
            conditions.push({
              target: parts[0],
              equals:
                op === 'eql'
                  ? values instanceof Array
                    ? values[0]
                    : this.tryParseDate(values)
                  : undefined,
              in: op === 'in' ? (values instanceof Array ? values : [values]) : undefined,
              between:
                op === 'between' &&
                values instanceof Array &&
                this.parseDate(values[0]) &&
                this.parseDate(values[1])
                  ? [this.parseDate(values[0]), this.parseDate(values[1])]
                  : undefined,
            });
          } catch (err) {
            // do nothing
          }
        }
      }
    }
    return conditions;
  }

  /**
   * This is used to parse querystring filter condition
   * based on earlier version prior to refactor
   * @param value
   */
  public static parseLegacyFilterCondition(value: string): FilterCondition<any>[] {
    // ex: provinceId:2|3,regencyId:3
    const conditions: FilterCondition<any>[] = [];
    if (value) {
      const filters = value.split(',');
      for (const filter of filters) {
        try {
          const parts = filter.split(':');
          const key = parts[0];
          const value = parts[1];

          // ensure that key doesn't have any non word char
          if (!key.match(/^\w+$/)) continue;

          if (key && value) {
            // value can be multi-value if | present
            const isMultiValue = value.indexOf('|') > -1;
            if (!isMultiValue) {
              conditions.push({
                target: key,
                equals: value,
              } as EqualsFilterCondition<string>);
            } else {
              const values = value.split('|');
              if (values.every((x) => x.match(/^[\w-]+$/))) {
                conditions.push({
                  target: key,
                  in: values,
                } as InFilterCondition<string>);
              }
            }
          }
        } catch (err) {
          // do nothing
        }
      }
    }
    return conditions;
  }

  private static tryParseDate(value: string): Date | string {
    try {
      const date = this.parseDate(value);
      return date;
    } catch (err) {
      return value;
    }
  }

  private static parseDate(value: string): Date {
    const date = DateTime.fromFormat(value, 'yyyy-LL-dd');
    if (date.isValid) {
      return date.toJSDate();
    } else {
      throw new Error('value is not date');
    }
  }

  public static mergeSortCondition(a: SortCondition[], b: SortCondition[]): SortCondition[] {
    return values(merge(keyBy(a, 'target'), keyBy(b, 'target')));
  }

  public static mergeFilterCondition(
    a: FilterCondition<any>[],
    b: FilterCondition<any>[],
  ): FilterCondition<any>[] {
    return values(merge(keyBy(a, 'target'), keyBy(b, 'target')));
  }
}
