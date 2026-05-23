import {describe, expect, it} from 'vitest';
import {
  adminInviteRequestSchema,
  cefrLevelSchema,
  polishCaseSchema,
} from './schema';

describe('platform schemas', () => {
  it('accepts CEFR levels from A1 through C1', () => {
    expect(['A1', 'A2', 'B1', 'B2', 'C1'].map((level) => cefrLevelSchema.parse(level))).toEqual([
      'A1',
      'A2',
      'B1',
      'B2',
      'C1',
    ]);
  });

  it('accepts all seven Polish cases', () => {
    expect(polishCaseSchema.options).toEqual([
      'nominative',
      'genitive',
      'dative',
      'accusative',
      'instrumental',
      'locative',
      'vocative',
    ]);
  });

  it('normalizes admin invitation email addresses', () => {
    expect(adminInviteRequestSchema.parse({email: '  Learner@Example.COM '})).toEqual({
      email: 'learner@example.com',
    });
  });
});
