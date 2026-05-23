import {describe, expect, it} from 'vitest';
import {getBrowserEnv} from './env';

describe('getBrowserEnv', () => {
  it('accepts valid browser-safe Supabase config', () => {
    expect(
      getBrowserEnv({
        VITE_SUPABASE_URL: 'https://example.supabase.co',
        VITE_SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
      } as unknown as ImportMetaEnv),
    ).toEqual({
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
    });
  });

  it('accepts Next-style public Supabase config as an alias', () => {
    expect(
      getBrowserEnv({
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
      } as unknown as ImportMetaEnv),
    ).toEqual({
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
    });
  });

  it('rejects missing browser-safe Supabase config', () => {
    expect(() => getBrowserEnv({} as unknown as ImportMetaEnv)).toThrow();
  });
});
