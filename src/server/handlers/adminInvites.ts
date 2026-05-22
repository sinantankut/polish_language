import {adminInviteRequestSchema} from '../../platform/schema';
import {requireAdmin as defaultRequireAdmin} from '../auth/requireAdmin';
import type {RequireAdminResult} from '../auth/requireAdmin';
import type {ApiRequest, JsonResponse} from '../http';
import {createSupabaseAdminClient as defaultCreateSupabaseAdminClient} from '../supabaseAdmin';

type SupabaseInviteAdminLike = {
  auth: {
    admin: {
      inviteUserByEmail: (email: string) => Promise<{error: unknown}>;
    };
  };
  from: (table: string) => {
    upsert: (
      value: Record<string, unknown>,
      options: {onConflict: string},
    ) => Promise<{error: unknown}>;
  };
};

export type CreateInvitationDependencies = {
  requireAdmin?: (req: ApiRequest) => Promise<RequireAdminResult>;
  createSupabaseAdminClient?: () => SupabaseInviteAdminLike;
};

export async function createInvitationHandler(
  req: ApiRequest,
  dependencies: CreateInvitationDependencies = {},
): Promise<JsonResponse> {
  if (req.method !== 'POST') {
    return {status: 405, body: {error: 'Method not allowed'}};
  }

  const authorize = dependencies.requireAdmin ?? defaultRequireAdmin;
  const admin = await authorize(req);

  if (admin.ok === false) {
    return {status: admin.status, body: {error: admin.message}};
  }

  const parsed = adminInviteRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return {status: 400, body: {error: 'Invalid email address'}};
  }

  const supabaseAdmin =
    dependencies.createSupabaseAdminClient?.() ??
    defaultCreateSupabaseAdminClient();
  const {error: inviteRowError} = await supabaseAdmin
    .from('invitations')
    .upsert(
      {
        email: parsed.data.email,
        status: 'pending',
        created_by: admin.user.id,
      },
      {onConflict: 'email'},
    );

  if (inviteRowError) {
    return {status: 500, body: {error: 'Could not create invitation'}};
  }

  const {error: authInviteError} =
    await supabaseAdmin.auth.admin.inviteUserByEmail(parsed.data.email);

  if (authInviteError) {
    return {
      status: 500,
      body: {error: 'Invitation saved, but email could not be sent'},
    };
  }

  return {
    status: 201,
    body: {
      email: parsed.data.email,
      status: 'pending',
    },
  };
}
