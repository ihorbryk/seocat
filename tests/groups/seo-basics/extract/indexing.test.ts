import { describe, expect, it } from 'vitest';
import { extract } from '../../../../src/groups/seo-basics/extract';
import { loadFixture, parseHtml } from '../../../helpers';

describe('seo-basics extract: canonical', () => {
  it('відносний href стає абсолютним', () => {
    expect(extract(loadFixture('canonical-relative')).canonical).toEqual([
      'https://example.com/page?x=1',
    ]);
  });
  it('усі теги в порядку документа, токен у rel, <body> враховано', () => {
    expect(extract(loadFixture('canonical-multiple')).canonical).toEqual([
      'https://example.com/a',
      'https://other.com/b',
      'https://example.com/c',
    ]);
  });
  it('без href або з порожнім href: Empty (порожній рядок)', () => {
    expect(extract(loadFixture('canonical-empty')).canonical).toEqual(['', '', '']);
  });
  it('тегів немає: порожній список', () => {
    expect(extract(loadFixture('canonical-missing')).canonical).toEqual([]);
  });
});

describe('seo-basics extract: robots', () => {
  it('чотири імена, регістр name, порядок документа', () => {
    expect(extract(loadFixture('robots-all')).robots).toEqual([
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'googlebot', content: 'noarchive' },
      { name: 'bingbot', content: 'nosnippet' },
      { name: 'googlebot-news', content: 'none' },
    ]);
  });
  it('порожній або відсутній content: Empty (порожній рядок)', () => {
    expect(extract(loadFixture('robots-empty')).robots).toEqual([
      { name: 'robots', content: '' },
      { name: 'bingbot', content: '' },
      { name: 'googlebot', content: 'noarchive' },
    ]);
  });
  it('name з пробілами навколо не збігається (без обрізання)', () => {
    const d = parseHtml(
      '<meta name=" robots " content="noindex"><meta name="robots " content="x">',
    );
    expect(extract(d).robots).toEqual([]);
  });
  it('тегів немає: порожній список', () => {
    expect(extract(loadFixture('canonical-missing')).robots).toEqual([]);
  });
});

describe('seo-basics extract: hreflang', () => {
  it('пари код і абсолютний URL; x-default і невалідні коди як є; порожній href = Empty', () => {
    expect(extract(loadFixture('hreflang-mixed')).hreflang).toEqual([
      { code: 'en', href: 'https://example.com/en' },
      { code: 'x-default', href: 'https://example.com/' },
      { code: 'zz_Bogus', href: 'https://example.com/zz' },
      { code: 'de', href: '' },
    ]);
  });
  it('тегів немає: порожній список', () => {
    expect(extract(loadFixture('canonical-missing')).hreflang).toEqual([]);
  });
});
