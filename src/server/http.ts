export type JsonResponse<T = unknown> = {
  status: number;
  body: T;
};

export type ApiRequest<TBody = unknown> = {
  method: string;
  headers: Record<string, string | string[] | undefined>;
  body?: TBody;
};
