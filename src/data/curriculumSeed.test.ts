import {describe, expect, it} from 'vitest';
import {curriculumLevels, curriculumUnits} from './curriculumSeed';

describe('curriculum seed', () => {
  it('models the full planned A1-C1 range', () => {
    expect(curriculumLevels).toEqual(['A1', 'A2', 'B1', 'B2', 'C1']);
  });

  it('only marks A2-B1 units as available in the first release', () => {
    const availableLevels = [
      ...new Set(
        curriculumUnits
          .filter((unit) => unit.status === 'available')
          .map((unit) => unit.level),
      ),
    ].sort();

    expect(availableLevels).toEqual(['A2', 'B1']);
  });
});
