import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { View } from '../../../src/groups/content/View';
import { assess } from '../../../src/groups/content/assess';
import type { ContentSnapshot } from '../../../src/groups/content/types';
import { contentSnapshot as snapshot } from '../../snapshot';

const snap = (over: Partial<ContentSnapshot> = {}): ContentSnapshot =>
  snapshot({
    title: { count: 1, value: 'Hello' },
    words: 1488,
    headings: [1, 4, 0, 2, 0, 0],
    ...over,
  });

describe('View Content', () => {
  it('показує рядок Title без URL (URL живе в каркасі попапа)', () => {
    render(<View view={assess(snap())} />);
    expect(screen.queryByTestId('url')).toBeNull();
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('плитки words/links з роздільниками тисяч', () => {
    render(<View view={assess(snap())} />);
    expect(screen.getByTestId('tile-words').textContent).toBe('1,488words');
    expect(screen.queryByTestId('tile-images')).toBeNull();
    expect(screen.getByTestId('tile-links').textContent).toBe('0links');
  });

  it('діаграма H1–H6: шість стовпчиків, нулі як заглушки', () => {
    render(<View view={assess(snap())} />);
    const bars = [1, 2, 3, 4, 5, 6].map((n) => screen.getByTestId(`h${n}`));
    expect(bars.map((b) => b.textContent)).toEqual(['1H1', '4H2', '0H3', '2H4', '0H5', '0H6']);
    expect(bars.map((b) => b.getAttribute('data-zero'))).toEqual([
      null,
      null,
      'true',
      null,
      'true',
      'true',
    ]);
  });
});
