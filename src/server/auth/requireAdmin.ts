import type {ApiRequest} from '../http';
import {createSupabaseAdminClient} from '../supabaseAdmin';

type SupabaseUser = {
  id: string;
  email?: string;
};

type SupabaseAdminLike = {
  auth: {
    getUser: (token: string) => Promise<{
      data: {user: SupabaseUser | null};
      error: unknown;
    }>;
  };
  from: (table: string) => {
    select: (columns: string) => {
      eq: (
        column: string,
        value: string,
      ) => {
        single: () => Promise<{
          data: {role?: string} | null;
          error: unknown;
        }>;
      };
    };
  };
};

export type RequireAdminDependencies = {
  createSupabaseAdminClient?: () => SupabaseAdminLike;
};

export type RequireAdminResult =
  | {ok: true; user: SupabaseUser}
  | {ok: false; status: 401 | 403; message: string};

function getBearerToken(header: string | string[] | undefined) {
  const value = Array.isArray(header) ? header[0] : header;

  if (!value) {
    return null;
  }

  return value.replace(/^Bearer\s+/i, '').trim() || null;
}

export async function requireAdmin(
  req: ApiRequest,
  dependencies: RequireAdminDependencies = {},
): Promise<RequireAdminResult> {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    return {ok: false, status: 401, message: 'Missing authorization token'};
  }

  const supabaseAdmin =
    dependencies.createSupabaseAdminClient?.() ?? createSupabaseAdminClient();
  const {data: userResult, error: userError} = await supabaseAdmin.auth.getUser(
    token,
  );

  if (userError || !userResult.user) {
    return {ok: false, status: 401, message: 'Invalid authorization token'};
  }

  const {data: profile, error: profileError} = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userResult.user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    return {ok: false, status: 403, message: 'Admin access required'};
  }

  return {ok: true, user: userResult.user};
}
