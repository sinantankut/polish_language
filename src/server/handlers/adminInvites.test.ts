import {describe, expect, it, vi} from 'vitest';
import {createInvitationHandler} from './adminInvites';

const adminUser = {id: '11111111-1111-4111-8111-111111111111'};

function createSupabaseAdminMock({
  upsertResult = {error: null},
  inviteResult = {error: null},
} = {}) {
  const upsert = vi.fn().mockResolvedValue(upsertResult);
  const from = vi.fn(() => ({upsert}));
  const inviteUserByEmail = vi.fn().mockResolvedValue(inviteResult);

  return {
    auth: {admin: {inviteUserByEmail}},
    from,
    calls: {from, inviteUserByEmail, upsert},
  };
}

describe('createInvitationHandler', () => {
  it('rejects non-POST requests', async () => {
    const result = await createInvitationHandler(
      {method: 'GET', headers: {}},
      {
        requireAdmin: vi.fn(),
        createSupabaseAdminClient: vi.fn(),
      },
    );

    expect(result).toEqual({status: 405, body: {error: 'Method not allowed'}});
  });

  it('returns auth failures from requireAdmin', async () => {
    const result = await createInvitationHandler(
      {method: 'POST', headers: {}, body: {email: 'learner@example.com'}},
      {
        requireAdmin: vi.fn().mockResolvedValue({
          ok: false,
          status: 403,
          message: 'Admin access required',
        }),
        createSupabaseAdminClient: vi.fn(),
      },
    );

    expect(result).toEqual({status: 403, body: {error: 'Admin access required'}});
  });

  it('rejects invalid email payloads', async () => {
    const result = await createInvitationHandler(
      {method: 'POST', headers: {}, body: {email: 'not-an-email'}},
      {
        requireAdmin: vi.fn().mockResolvedValue({ok: true, user: adminUser}),
        createSupabaseAdminClient: vi.fn(),
      },
    );

    expect(result).toEqual({status: 400, body: {error: 'Invalid email address'}});
  });

  it('reports invitation row failures', async () => {
    const supabaseAdmin = createSupabaseAdminMock({
      upsertResult: {error: new Error('database unavailable')},
    });

    const result = await createInvitationHandler(
      {method: 'POST', headers: {}, body: {email: 'learner@example.com'}},
      {
        requireAdmin: vi.fn().mockResolvedValue({ok: true, user: adminUser}),
        createSupabaseAdminClient: () => supabaseAdmin,
      },
    );

    expect(result).toEqual({status: 500, body: {error: 'Could not create invitation'}});
  });

  it('reports invitation email failures after saving the row', async () => {
    const supabaseAdmin = createSupabaseAdminMock({
      inviteResult: {error: new Error('email failed')},
    });

    const result = await createInvitationHandler(
      {method: 'POST', headers: {}, body: {email: 'learner@example.com'}},
      {
        requireAdmin: vi.fn().mockResolvedValue({ok: true, user: adminUser}),
        createSupabaseAdminClient: () => supabaseAdmin,
      },
    );

    expect(result).toEqual({
      status: 500,
      body: {error: 'Invitation saved, but email could not be sent'},
    });
  });

  it('creates a normalized pending invitation for admins', async () => {
    const supabaseAdmin = createSupabaseAdminMock();

    const result = await createInvitationHandler(
      {method: 'POST', headers: {}, body: {email: 'Learner@Example.COM'}},
      {
        requireAdmin: vi.fn().mockResolvedValue({ok: true, user: adminUser}),
        createSupabaseAdminClient: () => supabaseAdmin,
      },
    );

    expect(result).toEqual({
      status: 201,
      body: {email: 'learner@example.com', status: 'pending'},
    });
    expect(supabaseAdmin.calls.from).toHaveBeenCalledWith('invitations');
    expect(supabaseAdmin.calls.upsert).toHaveBeenCalledWith(
      {
        email: 'learner@example.com',
        status: 'pending',
        created_by: adminUser.id,
      },
      {onConflict: 'email'},
    );
    expect(supabaseAdmin.calls.inviteUserByEmail).toHaveBeenCalledWith(
      'learner@example.com',
    );
  });
});
