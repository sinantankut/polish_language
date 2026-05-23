import {fireEvent, render, screen, within} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {LearnMap} from './LearnMap';

describe('LearnMap', () => {
  it('opens a populated lesson workspace with original questions', () => {
    render(<LearnMap />);

    const workspace = screen.getByRole('region', {name: 'Lesson workspace'});
    expect(
      within(workspace).getByRole('heading', {
        name: 'Proszę się przedstawić / Przedstawmy się',
      }),
    ).toBeInTheDocument();
    expect(
      within(workspace).getByText(
        'Use instrumental forms to introduce roles, professions, and identity.',
      ),
    ).toBeInTheDocument();
    expect(
      within(workspace).getByText(
        'Write three sentences introducing yourself and another person. Include one profession and one interest.',
      ),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Open lesson Lekcja 13: Życie to nie bajka / Komu bije dzwon?',
      }),
    );

    expect(
      within(workspace).getByRole('heading', {
        name: 'Życie to nie bajka / Komu bije dzwon?',
      }),
    ).toBeInTheDocument();
    expect(
      within(workspace).getByText(
        'Give help or advice to three people using dative recipients.',
      ),
    ).toBeInTheDocument();
  });

  it('brings the lesson workspace back into view when opening a lesson', () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });

    render(<LearnMap />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Open lesson Lekcja 13: Życie to nie bajka / Komu bije dzwon?',
      }),
    );

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });
});
