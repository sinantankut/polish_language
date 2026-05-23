import {z} from 'zod';

const rawBrowserEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

export const browserEnvSchema = rawBrowserEnvSchema.transform((env, ctx) => {
  const supabaseUrl = env.VITE_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    ctx.addIssue({
      code: 'custom',
      path: ['VITE_SUPABASE_URL'],
      message:
        'Set VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL for browser auth.',
    });
  }

  if (!publishableKey) {
    ctx.addIssue({
      code: 'custom',
      path: ['VITE_SUPABASE_PUBLISHABLE_KEY'],
      message:
        'Set VITE_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
    });
  }

  return {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_PUBLISHABLE_KEY: publishableKey,
  };
});

export type BrowserEnv = z.infer<typeof browserEnvSchema>;

export function getBrowserEnv(env: ImportMetaEnv = import.meta.env): BrowserEnv {
  return browserEnvSchema.parse(env);
}
