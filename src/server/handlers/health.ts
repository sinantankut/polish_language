import type {JsonResponse} from '../http';

export type HealthResponse = {
  ok: true;
  status: 'ok';
  app: 'polish-language-platform';
  hasApiKey: boolean;
  time: string;
};

export function healthHandler({
  hasApiKey = false,
  now = new Date(),
}: {
  hasApiKey?: boolean;
  now?: Date;
} = {}): JsonResponse<HealthResponse> {
  return {
    status: 200,
    body: {
      ok: true,
      status: 'ok',
      app: 'polish-language-platform',
      hasApiKey,
      time: now.toISOString(),
    },
  };
}
