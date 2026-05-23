import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import type {AuthState} from './authTypes';
import {AuthGate} from './AuthGate';

const authHarness = vi.hoisted(() => ({
  auth: null as AuthState | null,
}));

vi.mock('./AuthProvider', () => ({
  useAuth: () => {
    if (!authHarness.auth) {
      throw new Error('Auth test state missing');
    }

    return authHarness.auth;
  },
}));

function createAuthState(overrides: Partial<AuthState> = {}): AuthState {
  return {
    session: null,
    user: null,
    profile: null,
    loading: false,
    error: null,
    signInWithEmail: vi.fn(),
    signInWithPassword: vi.fn().mockResolvedValue(undefined),
    signOut: vi.fn(),
    ...overrides,
  };
}

describe('AuthGate', () => {
  beforeEach(() => {
    authHarness.auth = createAuthState();
  });

  it('signs in with email and password credentials', async () => {
    const signInWithPassword = vi.fn().mockResolvedValue(undefined);
    authHarness.auth = createAuthState({signInWithPassword});

    render(
      <AuthGate>
        <div>App</div>
      </AuthGate>,
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: {value: 'admin@example.com'},
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: {value: 'password'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Sign in'}));

    await waitFor(() => {
      expect(signInWithPassword).toHaveBeenCalledWith(
        'admin@example.com',
        'password',
      );
    });
  });
});
