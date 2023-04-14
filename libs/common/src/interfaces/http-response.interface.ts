export interface HttpErrorResponse {
  ok: false;
  error: {
    code: string;
    details?: any;
  };
}

export type HttpSuccessResponse<T> = {
  ok: true;
} & T;

export type HttpResponse<T> = HttpErrorResponse | HttpSuccessResponse<T>;
