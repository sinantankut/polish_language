import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import type {ReactNode} from 'react';
import type {Session, User} from '@supabase/supabase-js';
import {supabase} from '../../lib/supabaseClient';
import type {Profile} from '../schema';
import {profileSchema} from '../schema';
import type {AuthState} from './authTypes';

const AuthContext = createContext<AuthState | null>(null);
const DEVELOPMENT_ADMIN_EMAIL = 'admin@example.com';
const DEVELOPMENT_ADMIN_PASSWORD = 'password';
const DEVELOPMENT_ADMIN_USER_ID = '11111111-1111-4111-8111-111111111111';

type ProfileRow = {
  id: string;
  email: string;
  role: string;
  cefr_goal?: string | null;
  cefr_level?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function mapProfile(row: ProfileRow): Profile {
  const now = new Date().toISOString();

  return profileSchema.parse({
    id: row.id,
    email: row.email,
    role: row.role,
    cefrLevel: row.cefr_goal ?? row.cefr_level ?? 'B1',
    createdAt: row.created_at ?? now,
    updatedAt: row.updated_at ?? now,
  });
}

export function isDevelopmentAdminCredential(email: string, password: string) {
  return (
    import.meta.env.DEV &&
    email.trim().toLowerCase() === DEVELOPMENT_ADMIN_EMAIL &&
    password === DEVELOPMENT_ADMIN_PASSWORD
  );
}

function createDevelopmentAdminSession() {
  const now = new Date().toISOString();
  const user = {
    id: DEVELOPMENT_ADMIN_USER_ID,
    email: DEVELOPMENT_ADMIN_EMAIL,
  } as User;
  const session = {
    access_token: 'development-admin-token',
    refresh_token: 'development-admin-refresh-token',
    expires_in: 60 * 60,
    token_type: 'bearer',
    user,
  } as Session;
  const profile = profileSchema.parse({
    id: user.id,
    email: user.email,
    role: 'admin',
    cefrLevel: 'B1',
    createdAt: now,
    updatedAt: now,
  });

  return {profile, session};
}

async function loadProfile(user: User | null) {
  if (!user) {
    return null;
  }

  const {data, error} = await supabase
    .from('profiles')
    .select('id,email,role,cefr_goal,created_at,updated_at')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Profile not found');
  }

  return mapProfile(data as ProfileRow);
}

export function AuthProvider({children}: {children: ReactNode}) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let subscription: {unsubscribe: () => void} | null = null;

    async function syncSession(nextSession: Session | null) {
      setSession(nextSession);

      if (!nextSession?.user) {
        setProfile(null);
        return;
      }

      try {
        const nextProfile = await loadProfile(nextSession.user);

        if (!cancelled) {
          setProfile(nextProfile);
          setError(null);
        }
      } catch (profileError) {
        if (!cancelled) {
          setProfile(null);
          setError(
            profileError instanceof Error
              ? profileError.message
              : 'Could not load profile',
          );
        }
      }
    }

    try {
      const authClient = supabase.auth;

      authClient
        .getSession()
        .then(({data}) => syncSession(data.session))
        .catch((sessionError) => {
          if (!cancelled) {
            setError(
              sessionError instanceof Error
                ? sessionError.message
                : 'Could not load session',
            );
          }
        })
        .finally(() => {
          if (!cancelled) {
            setLoading(false);
          }
        });

      const {
        data: {subscription: authSubscription},
      } = authClient.onAuthStateChange((_event, nextSession) => {
        void syncSession(nextSession);
      });

      subscription = authSubscription;
    } catch (sessionError) {
      if (!cancelled) {
        setError(
          sessionError instanceof Error
            ? sessionError.message
            : 'Could not load session',
        );
        setLoading(false);
      }
    }

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      error,
      signInWithEmail: async (email: string) => {
        setError(null);
        const {error: signInError} = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
          },
        });

        if (signInError) {
          setError(signInError.message);
          throw signInError;
        }
      },
      signInWithPassword: async (email: string, password: string) => {
        setError(null);

        if (isDevelopmentAdminCredential(email, password)) {
          const devAdmin = createDevelopmentAdminSession();

          setSession(devAdmin.session);
          setProfile(devAdmin.profile);
          return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const {data, error: signInError} = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          throw signInError;
        }

        setSession(data.session);

        if (data.user) {
          try {
            const nextProfile = await loadProfile(data.user);

            setProfile(nextProfile);
          } catch (profileError) {
            const message =
              profileError instanceof Error
                ? profileError.message
                : 'Could not load profile';

            setError(message);
            throw profileError;
          }
        }
      },
      signOut: async () => {
        await supabase.auth.signOut();
        setSession(null);
        setProfile(null);
      },
    }),
    [error, loading, profile, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
