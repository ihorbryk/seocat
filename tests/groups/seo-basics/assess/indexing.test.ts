import { describe, expect, it } from 'vitest';
import { assess } from '../../../../src/groups/seo-basics/assess';
import type { PageSnapshot } from '../../../../src/groups/seo-basics/types';
import { snapshot } from '../../../snapshot';

const EMPTY = { kind: 'badge', badge: { text: 'Empty', tone: 'warn' } } as const;
const MISSING = { text: 'Missing', tone: 'warn' } as const;

function row(id: string, patch: Partial<PageSnapshot>) {
  const snap = snapshot({ title: { count: 1, value: 'x' }, ...patch });
  const section = assess(snap).sections.find((s) => s.id === 'indexing');
  const found = section?.rows.find((r) => r.id === id);
  if (!found) throw new Error(`рядок ${id} не знайдено`);
  return found;
}

describe('assess: секція Indexing', () => {
  it('іде після Meta, заголовок Indexing, рядки Canonical, Robots, hreflang', () => {
    const sections = assess(snapshot({ title: { count: 0, value: null } })).sections;
    expect(sections.map((s) => s.id)).toEqual(['meta', 'indexing']);
    const indexing = sections[1];
    expect(indexing?.title).toBe('Indexing');
    expect(indexing?.rows.map((r) => r.label)).toEqual(['Canonical', 'Robots', 'hreflang']);
  });
});

describe('assess: Canonical', () => {
  it('Missing без значень і без кількості', () => {
    const r = row('canonical', { canonical: [] });
    expect(r.badges).toEqual([MISSING]);
    expect(r.values).toEqual([]);
    expect(r.count).toBeUndefined();
  });
  it('один тег: кількість 1 і значення', () => {
    const r = row('canonical', { canonical: ['https://example.com/a'] });
    expect(r.count).toBe(1);
    expect(r.badges).toEqual([]);
    expect(r.values).toEqual([{ kind: 'text', text: 'https://example.com/a' }]);
  });
  it('кілька: Duplicate ×N і всі записи', () => {
    const r = row('canonical', {
      canonical: ['https://a.com/', 'https://b.com/', 'https://c.com/'],
    });
    expect(r.badges).toEqual([{ text: 'Duplicate ×3', tone: 'warn' }]);
    expect(r.values).toHaveLength(3);
  });
  it('порожній href: бейдж Empty замість значення', () => {
    const r = row('canonical', { canonical: [''] });
    expect(r.values).toEqual([EMPTY]);
  });
});

describe('assess: Robots', () => {
  it('Missing без показу index, follow', () => {
    const r = row('robots', { robots: [] });
    expect(r.badges).toEqual([MISSING]);
    expect(r.values).toEqual([]);
  });
  it('записи `name: content`, кількість у лівій колонці', () => {
    const r = row('robots', {
      robots: [
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'googlebot', content: 'noarchive' },
      ],
    });
    expect(r.count).toBe(2);
    expect(r.badges).toEqual([]);
    expect(r.values).toEqual([
      { kind: 'text', text: 'robots: noindex, nofollow' },
      { kind: 'text', text: 'googlebot: noarchive' },
    ]);
  });
  it('порожній content: Empty з іменем перед бейджем', () => {
    const r = row('robots', { robots: [{ name: 'bingbot', content: '' }] });
    expect(r.values).toEqual([{ ...EMPTY, prefix: 'bingbot: ' }]);
  });
});

describe('assess: hreflang', () => {
  it('Missing', () => {
    expect(row('hreflang', { hreflang: [] }).badges).toEqual([MISSING]);
  });
  it('пари `код → URL`, x-default і невалідні коди як є', () => {
    const r = row('hreflang', {
      hreflang: [
        { code: 'en', href: 'https://example.com/en' },
        { code: 'x-default', href: 'https://example.com/' },
        { code: 'zz_Bogus', href: 'https://example.com/zz' },
      ],
    });
    expect(r.count).toBe(3);
    expect(r.values).toEqual([
      { kind: 'text', text: 'en → https://example.com/en' },
      { kind: 'text', text: 'x-default → https://example.com/' },
      { kind: 'text', text: 'zz_Bogus → https://example.com/zz' },
    ]);
  });
  it('порожній href: Empty для запису', () => {
    const r = row('hreflang', { hreflang: [{ code: 'de', href: '' }] });
    expect(r.values).toEqual([{ ...EMPTY, prefix: 'de → ' }]);
  });
});
