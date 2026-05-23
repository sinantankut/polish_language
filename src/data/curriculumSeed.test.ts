import {describe, expect, it} from 'vitest';
import {curriculumLevels, curriculumUnits} from './curriculumSeed';

describe('curriculum seed', () => {
  it('models the full planned A1-C1 range', () => {
    expect(curriculumLevels).toEqual(['A1', 'A2', 'B1', 'B2', 'C1']);
  });

  it('populates A2-B1 from the Polish krok po kroku 2 chapter sequence', () => {
    const textbookUnits = curriculumUnits.filter(
      (unit) => unit.source === 'Polski krok po kroku 2',
    );

    expect(textbookUnits).toHaveLength(23);
    expect(textbookUnits.map((unit) => unit.id)).toEqual([
      'kpk2-lesson-01',
      'kpk2-lesson-02',
      'kpk2-lesson-03',
      'kpk2-lesson-04',
      'kpk2-lesson-05',
      'kpk2-lesson-06',
      'kpk2-lesson-07',
      'kpk2-lesson-08',
      'kpk2-lesson-09',
      'kpk2-lesson-10',
      'kpk2-lesson-11',
      'kpk2-lesson-12',
      'kpk2-lesson-13',
      'kpk2-lesson-14',
      'kpk2-lesson-15',
      'kpk2-lesson-16',
      'kpk2-lesson-17',
      'kpk2-lesson-18',
      'kpk2-lesson-19',
      'kpk2-lesson-20',
      'kpk2-lesson-21',
      'kpk2-lesson-22',
      'kpk2-lesson-23',
    ]);
    expect(textbookUnits[0]).toMatchObject({
      level: 'A2',
      lesson: 'Lekcja 01',
      title: 'Proszę się przedstawić / Przedstawmy się',
      grammar: ['instrumental case'],
    });
    expect(textbookUnits[22]).toMatchObject({
      level: 'B1',
      lesson: 'Lekcja 23',
      title: 'Nauczycielka / Czas na egzamin',
      grammar: ['certification exam review'],
    });
  });

  it('adds lesson objectives and original practice questions to every textbook lesson', () => {
    const textbookUnits = curriculumUnits.filter(
      (unit) => unit.source === 'Polski krok po kroku 2',
    );

    for (const unit of textbookUnits) {
      expect(unit.objectives, unit.id).toHaveLength(3);
      expect(unit.lessonFlow, unit.id).toHaveLength(3);
      expect(unit.practiceQuestions, unit.id).toHaveLength(3);
      expect(
        unit.practiceQuestions.map((question) => question.skill),
        unit.id,
      ).toEqual(['communication', 'vocabulary', 'grammar']);
    }

    const allPrompts = textbookUnits
      .flatMap((unit) => unit.practiceQuestions.map((question) => question.prompt))
      .join('\n');

    expect(allPrompts).not.toContain('Ćwiczenie');
    expect(allPrompts).not.toContain('Proszę uzupełnić');
    expect(allPrompts).not.toContain('Proszę dopasować');
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
