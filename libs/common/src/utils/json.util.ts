export class JsonUtils {
  /**
   *
   * @param data
   * @returns
   */
  public static toSnakeCase<TParam, TResponse>(data: TParam): TResponse {
    if (typeof data !== 'object' || data === null) {
      return data as unknown as TResponse;
    }

    if (Array.isArray(data)) {
      return data.map((item) => JsonUtils.toSnakeCase(item)) as unknown as TResponse;
    }

    const convertedData = {} as TResponse;
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const snakeCaseKey = key.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase());
        const value = data[key];
        convertedData[snakeCaseKey] = JsonUtils.toSnakeCase(value);
      }
    }

    return convertedData;
  }
}
