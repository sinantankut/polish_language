import {createClient} from '@supabase/supabase-js';
import {getBrowserEnv} from '../config/env';

const env = getBrowserEnv();

export const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
