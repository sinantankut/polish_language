import {describe, expect, it} from 'vitest';
import {declensionRows} from './declensionTables';

describe('declension tables', () => {
  it('contains the seven Polish cases', () => {
    expect(declensionRows.map((row) => row.caseId)).toEqual([
      'nominative',
      'genitive',
      'dative',
      'accusative',
      'instrumental',
      'locative',
      'vocative',
    ]);
  });
});
