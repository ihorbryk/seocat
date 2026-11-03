import { describe, expect, it } from 'vitest';
import { assess } from '../../../../src/groups/seo-basics/assess';
import type { PageSnapshot } from '../../../../src/groups/seo-basics/types';

function descRow(description: PageSnapshot['description']) {
  const view = assess({
    url: 'https://example.com/',
    title: { count: 0, value: null },
    description,
  });
  const row = view.sections.find((s) => s.id === 'meta')?.rows.find((r) => r.id === 'description');
  if (!row) throw new Error('рядок Description не знайдено');
  return row;
}
const text = (n: number) => 'a'.repeat(n);

describe('assess: Description', () => {
  it('Missing: без довжини і значень', () => {
    const row = descRow({ count: 0, value: null });
    expect(row.label).toBe('Description');
    expect(row.badges).toEqual([{ text: 'Missing', tone: 'warn' }]);
    expect(row.values).toEqual([]);
  });
  it('Empty: без рейтингу', () => {
    expect(descRow({ count: 1, value: '' }).badges).toEqual([{ text: 'Empty', tone: 'warn' }]);
  });
  it.each([
    [69, 'Short', 'warn'],
    [70, 'Good', 'good'],
    [160, 'Good', 'good'],
    [161, 'Long', 'warn'],
  ] as const)('межа %i -> %s', (n, label, tone) => {
    const row = descRow({ count: 1, value: text(n) });
    expect(row.badges).toEqual([{ text: `${n} chars · ${label}`, tone }]);
    expect(row.values).toEqual([{ kind: 'text', text: text(n) }]);
  });
  it('Duplicate: рейтинг першого значення', () => {
    expect(descRow({ count: 2, value: text(100) }).badges).toEqual([
      { text: 'Duplicate ×2', tone: 'warn' },
      { text: '100 chars · Good', tone: 'good' },
    ]);
  });
});
