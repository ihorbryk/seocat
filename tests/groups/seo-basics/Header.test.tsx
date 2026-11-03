import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { View } from '../../../src/groups/seo-basics/View';
import { assess } from '../../../src/groups/seo-basics/assess';
import type { PageSnapshot } from '../../../src/groups/seo-basics/types';

const snap = (over: Partial<PageSnapshot> = {}): PageSnapshot => ({
  url: 'https://example.com/a?b=1&c=2#frag',
  title: { count: 1, value: 'Hello' },
  description: { count: 0, value: null },
  words: 1488,
  images: 12,
  links: 0,
  headings: [1, 4, 0, 2, 0, 0],
  ...over,
});

describe('View seo-basics', () => {
  it('показує повний URL без нормалізації і рядок Title', () => {
    const s = snap();
    render(<View view={assess(s)} />);
    expect(screen.getByTestId('url').textContent).toBe(s.url);
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('плитки words/images/links з роздільниками тисяч', () => {
    render(<View view={assess(snap())} />);
    expect(screen.getByTestId('tile-words').textContent).toBe('1,488words');
    expect(screen.getByTestId('tile-images').textContent).toBe('12images');
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
