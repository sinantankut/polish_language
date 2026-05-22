import {describe, expect, it, vi} from 'vitest';
import {requireAdmin} from './requireAdmin';

const adminUserId = '11111111-1111-4111-8111-111111111111';

function createRequest(authorization?: string) {
  return {
    method: 'POST',
    headers: authorization ? {authorization} : {},
  };
}

function createSupabaseAdminMock({
  userResult,
  profileResult,
}: {
  userResult: unknown;
  profileResult?: unknown;
}) {
  const single = vi.fn().mockResolvedValue(profileResult);
  const eq = vi.fn(() => ({single}));
  const select = vi.fn(() => ({eq}));
  const from = vi.fn(() => ({select}));
  const getUser = vi.fn().mockResolvedValue(userResult);

  return {
    auth: {getUser},
    from,
    calls: {eq, from, getUser, select, single},
  };
}

describe('requireAdmin', () => {
  it('rejects requests without a bearer token', async () => {
    const result = await requireAdmin(createRequest(), {
      createSupabaseAdminClient: vi.fn(),
    });

    expect(result).toEqual({
      ok: false,
      status: 401,
      message: 'Missing authorization token',
    });
  });

  it('rejects invalid tokens', async () => {
    const supabaseAdmin = createSupabaseAdminMock({
      userResult: {data: {user: null}, error: new Error('invalid')},
    });

    const result = await requireAdmin(createRequest('Bearer bad-token'), {
      createSupabaseAdminClient: () => supabaseAdmin,
    });

    expect(result).toEqual({
      ok: false,
      status: 401,
      message: 'Invalid authorization token',
    });
    expect(supabaseAdmin.calls.getUser).toHaveBeenCalledWith('bad-token');
  });

  it('rejects authenticated non-admin users', async () => {
    const supabaseAdmin = createSupabaseAdminMock({
      userResult: {data: {user: {id: adminUserId}}, error: null},
      profileResult: {data: {role: 'learner'}, error: null},
    });

    const result = await requireAdmin(createRequest('Bearer learner-token'), {
      createSupabaseAdminClient: () => supabaseAdmin,
    });

    expect(result).toEqual({
      ok: false,
      status: 403,
      message: 'Admin access required',
    });
    expect(supabaseAdmin.calls.from).toHaveBeenCalledWith('profiles');
    expect(supabaseAdmin.calls.eq).toHaveBeenCalledWith('id', adminUserId);
  });

  it('returns the user for authenticated admins', async () => {
    const user = {id: adminUserId, email: 'admin@example.com'};
    const supabaseAdmin = createSupabaseAdminMock({
      userResult: {data: {user}, error: null},
      profileResult: {data: {role: 'admin'}, error: null},
    });

    const result = await requireAdmin(createRequest('Bearer admin-token'), {
      createSupabaseAdminClient: () => supabaseAdmin,
    });

    expect(result).toEqual({ok: true, user});
  });
});
