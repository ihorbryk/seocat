import { describe, expect, it } from 'vitest';
import { assess } from '../../../../src/groups/content/assess';
import type { ContentSnapshot } from '../../../../src/groups/content/types';
import { contentSnapshot as snapshot } from '../../../snapshot';

function titleRow(title: ContentSnapshot['title']) {
  const view = assess(snapshot({ title }));
  const meta = view.sections.find((s) => s.id === 'meta');
  const row = meta?.rows.find((r) => r.id === 'title');
  if (!row) throw new Error('рядок Title не знайдено');
  return row;
}

const text = (n: number) => 'a'.repeat(n);

describe('assess Content', () => {
  it('одна секція Meta з рядками Title і Description; URL у хедері немає', () => {
    const view = assess(snapshot());
    expect(view.sections.map((s) => s.id)).toEqual(['meta']);
    expect(view.sections[0]?.rows.map((r) => r.label)).toEqual(['Title', 'Description']);
    expect(view.header).not.toHaveProperty('url');
  });
});

describe('assess: Title', () => {
  it('Missing: бейдж без довжини і значень', () => {
    const row = titleRow({ count: 0, value: null });
    expect(row.label).toBe('Title');
    expect(row.badges).toEqual([{ text: 'Missing', tone: 'warn' }]);
    expect(row.values).toEqual([]);
  });

  it('Empty: бейдж без `0 chars · Short`', () => {
    const row = titleRow({ count: 1, value: '' });
    expect(row.badges).toEqual([{ text: 'Empty', tone: 'warn' }]);
    expect(row.values).toEqual([]);
  });

  it('Good: значення і зелений бейдж довжини', () => {
    const row = titleRow({ count: 1, value: text(57) });
    expect(row.values).toEqual([{ kind: 'text', text: text(57) }]);
    expect(row.badges).toEqual([{ text: '57 chars · Good', tone: 'good' }]);
  });

  it.each([
    [29, 'Short', 'warn'],
    [30, 'Good', 'good'],
    [60, 'Good', 'good'],
    [61, 'Long', 'warn'],
  ] as const)('межа %i -> %s', (n, label, tone) => {
    expect(titleRow({ count: 1, value: text(n) }).badges).toEqual([
      { text: `${n} chars · ${label}`, tone },
    ]);
  });

  it('довжина в графемах: емодзі і кирилиця', () => {
    expect(titleRow({ count: 1, value: '👍🏽' + 'я'.repeat(29) }).badges[0]?.text).toBe(
      '30 chars · Good',
    );
  });

  it('Duplicate: ×N поряд з довжиною і рейтингом першого значення', () => {
    const row = titleRow({ count: 3, value: text(40) });
    expect(row.badges).toEqual([
      { text: '40 chars · Good', tone: 'good' },
      { text: 'Duplicate ×3', tone: 'warn' },
    ]);
    expect(row.values).toEqual([{ kind: 'text', text: text(40) }]);
  });
});
