import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { View } from '../../../src/groups/content/View';
import { assess } from '../../../src/groups/content/assess';
import type { ContentSnapshot } from '../../../src/groups/content/types';
import { heading as h, contentSnapshot as snapshot } from '../../snapshot';

const snap = (over: Partial<ContentSnapshot> = {}): ContentSnapshot =>
  snapshot({
    title: { count: 1, value: 'Hello' },
    words: 1488,
    headings: [h(1, 'A'), h(2, 'B'), h(2, 'C'), h(4, 'D'), h(2, 'E'), h(4, 'F'), h(2, 'G')],
    ...over,
  });

describe('View Content', () => {
  it('показує рядок Title без URL (URL живе в каркасі попапа)', () => {
    render(<View view={assess(snap())} />);
    expect(screen.queryByTestId('url')).toBeNull();
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('плитка words з роздільниками тисяч; images і links живуть на своїх вкладках', () => {
    render(<View view={assess(snap())} />);
    expect(screen.getByTestId('tile-words').textContent).toBe('1,488words');
    expect(screen.queryByTestId('tile-images')).toBeNull();
    expect(screen.queryByTestId('tile-links')).toBeNull();
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

  it('Outline: кожен Heading у порядку документа з міткою рівня і відступом за власним рівнем', () => {
    render(
      <View view={assess(snap({ headings: [h(1, 'Intro'), h(3, 'Skipped H2'), h(2, 'Back')] }))} />,
    );
    expect(screen.getByText('Outline')).toBeTruthy();
    const rows = screen.getAllByTestId(/^heading-/);
    expect(rows.map((r) => r.textContent)).toEqual(['H1Intro', 'H3Skipped H2', 'H2Back']);
    expect(rows.map((r) => r.getAttribute('data-level'))).toEqual(['1', '3', '2']);
    expect(rows[1]!.getAttribute('title')).toBe('Skipped H2');
  });

  it('Outline: без тексту показує alt Image з приміткою img, без обох — бейдж Empty', () => {
    render(<View view={assess(snap({ headings: [h(1, '', ['', 'Brand']), h(2, '', [''])] }))} />);
    const rows = screen.getAllByTestId(/^heading-/);
    expect(rows.map((r) => r.textContent)).toEqual(['H1img Brand', 'H2Empty']);
  });

  it('Outline: Page без Headings показує повідомлення, діаграма з нулями', () => {
    render(<View view={assess(snap({ headings: [] }))} />);
    expect(screen.getByText('No headings on this page')).toBeTruthy();
    expect(screen.queryAllByTestId(/^heading-/)).toEqual([]);
    expect(screen.getByTestId('h1').textContent).toBe('0H1');
  });
});
