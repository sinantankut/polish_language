import {z} from 'zod';

export const browserEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

export type BrowserEnv = z.infer<typeof browserEnvSchema>;

export function getBrowserEnv(env: ImportMetaEnv = import.meta.env): BrowserEnv {
  return browserEnvSchema.parse(env);
}
