import { describe, expect, it } from 'vitest';
import { assess } from '../../../../src/groups/content/assess';
import type { ContentSnapshot } from '../../../../src/groups/content/types';
import { contentSnapshot as snapshot } from '../../../snapshot';

function descRow(description: ContentSnapshot['description']) {
  const view = assess(snapshot({ title: { count: 0, value: null }, description }));
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
    expect(row.values).toEqual([{ kind: 'text', text: text(n), copy: text(n) }]);
  });
  it('Duplicate: рейтинг першого значення', () => {
    expect(descRow({ count: 2, value: text(100) }).badges).toEqual([
      { text: '100 chars · Good', tone: 'good' },
      { text: 'Duplicate ×2', tone: 'warn' },
    ]);
  });
});

describe('assess: копіювання Description', () => {
  it('є значення: copy несе показане значення', () => {
    expect(descRow({ count: 1, value: 'Food for picky cats.' }).values[0]).toMatchObject({
      copy: 'Food for picky cats.',
    });
  });

  it('Long: copy несе все значення без обрізання', () => {
    expect(descRow({ count: 1, value: text(200) }).values[0]).toMatchObject({ copy: text(200) });
  });

  it('Duplicate: copy несе значення першого тега', () => {
    expect(descRow({ count: 2, value: 'First description' }).values[0]).toMatchObject({
      copy: 'First description',
    });
  });

  it.each([
    ['Missing', { count: 0, value: null }],
    ['Empty', { count: 1, value: '' }],
  ] as const)('%s: записів, а отже й copy, немає', (_, description) => {
    expect(descRow(description).values).toEqual([]);
  });
});
