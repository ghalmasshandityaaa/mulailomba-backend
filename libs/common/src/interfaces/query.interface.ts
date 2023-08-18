export interface IPaginatedQuery {
  page?: number;
  pageSize?: number;
  lastData?: number;
}

export interface ISearchableQuery {
  searchBy?: SearchCondition[];
}

export interface IFilterableQuery {
  filterBy?: FilterCondition<any>[];
}

export interface ISortableQuery {
  sortBy?: SortCondition[];
}

export interface SortCondition {
  target: string;
  direction: 'ASC' | 'DESC';
}

export interface SearchCondition {
  target: string;
  contains?: string;
  equals?: string; // same as exact search
}

export interface DateRangeFilterCondition {
  target: string;
  between?: [Date, Date];
}

export interface NumberRangeFilterCondition {
  target: string;
  between: [number, number];
}

export interface EqualsFilterCondition<T> {
  target: string;
  equals: T;
}

export interface InFilterCondition<T> {
  target: string;
  in: T[];
}

export type FilterCondition<T> =
  | DateRangeFilterCondition
  | NumberRangeFilterCondition
  | EqualsFilterCondition<T>
  | InFilterCondition<T>;

export function isDateRangeFilterCondition(condition: any): condition is DateRangeFilterCondition {
  return 'between' in condition && condition.between !== undefined;
}

export function isNumberRangeFilterCondition(
  condition: any,
): condition is NumberRangeFilterCondition {
  return 'between' in condition && condition.between !== undefined;
}

export function isEqualsFilterCondition<T = any>(
  condition: any,
): condition is EqualsFilterCondition<T> {
  return 'equals' in condition && condition.equals !== undefined;
}

export function isInFilterCondition<T = any>(condition: any): condition is InFilterCondition<T> {
  return 'in' in condition && condition.in !== undefined;
}
