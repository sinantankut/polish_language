import {describe, expect, it} from 'vitest';
import {isDevelopmentAdminCredential} from './AuthProvider';

describe('development admin credentials', () => {
  it('accepts the local admin email and password only in development', () => {
    expect(isDevelopmentAdminCredential(' ADMIN@EXAMPLE.COM ', 'password')).toBe(
      true,
    );
    expect(isDevelopmentAdminCredential('admin@example.com', 'wrong')).toBe(
      false,
    );
    expect(isDevelopmentAdminCredential('learner@example.com', 'password')).toBe(
      false,
    );
  });
});
