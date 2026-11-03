import { describe, expect, it } from 'vitest';
import { assess } from '../../../../src/groups/links/assess';
import type { LinkEntry } from '../../../../src/groups/links/types';
import { linkEntry, linksSnapshot } from '../../../snapshot';

const assessOne = (over: Partial<LinkEntry>, page = 'https://www.example.com/blog') =>
  assess(linksSnapshot({ page, links: [linkEntry(over)] })).links[0]!;

const scope = (href: string, page?: string) =>
  assessOne({ href }, page).filters.filter((f) => f === 'internal' || f === 'external');

describe('links assess: Internal і External', () => {
  it('той самий host Internal, префікс www., схема і порт не важать', () => {
    expect(scope('https://www.example.com/a')).toEqual(['internal']);
    expect(scope('http://example.com:8080/a')).toEqual(['internal']);
    expect(scope('https://example.com/a', 'http://example.com/')).toEqual(['internal']);
  });

  it('fragment на самій Page і порожній href — Internal', () => {
    expect(scope('https://www.example.com/blog#top')).toEqual(['internal']);
    expect(scope('')).toEqual(['internal']);
  });

  it('інший host і піддомен — External', () => {
    expect(scope('https://other.org/')).toEqual(['external']);
    expect(scope('https://blog.example.com/')).toEqual(['external']);
    expect(scope('https://www.blog.example.com/')).toEqual(['external']);
  });

  it('mailto:, tel:, javascript: — ні Internal, ні External', () => {
    expect(scope('mailto:hi@example.com')).toEqual([]);
    expect(scope('tel:+380000000')).toEqual([]);
    expect(scope('javascript:void(0)')).toEqual([]);
  });

  it('External має бейдж External, Internal — без бейджа', () => {
    expect(assessOne({ href: 'https://other.org/' }).badges.map((b) => b.text)).toEqual([
      'External',
    ]);
    expect(assessOne({ href: 'https://example.com/' }).badges).toEqual([]);
  });
});

describe('links assess: Nofollow', () => {
  it('nofollow, sponsored і ugc — Nofollow, кожне бейджем; noopener і noreferrer не показуються', () => {
    const link = assessOne({ rel: ['noopener', 'ugc', 'nofollow', 'noreferrer', 'sponsored'] });
    expect(link.filters).toContain('nofollow');
    expect(link.badges.map((b) => b.text)).toEqual(['nofollow', 'sponsored', 'ugc']);
    expect(link.badges.every((b) => b.tone === 'neutral')).toBe(true);
  });

  it('лише noopener — не Nofollow', () => {
    expect(assessOne({ rel: ['noopener'] }).filters).not.toContain('nofollow');
  });
});

describe('links assess: Anchor text', () => {
  it('текст має перевагу над alt Image', () => {
    expect(assessOne({ text: 'Home', imageAlts: ['Logo'] }).anchor).toEqual({
      kind: 'text',
      text: 'Home',
    });
  });

  it('без тексту: непорожні alt Images через пробіл', () => {
    expect(assessOne({ text: '', imageAlts: ['Logo', '', 'Shop'] }).anchor).toEqual({
      kind: 'image',
      text: 'Logo Shop',
    });
  });

  it('ні тексту, ні alt — Empty з попередженням і фільтр empty-anchor', () => {
    const link = assessOne({ text: '', imageAlts: [''] });
    expect(link.anchor).toEqual({ kind: 'badge', badge: { text: 'Empty', tone: 'warn' } });
    expect(link.filters).toContain('empty-anchor');
  });
});

describe('links assess: адреса', () => {
  it('веб-адреса клікабельна, інші схеми — текст, порожній href — Empty', () => {
    expect(assessOne({ href: 'https://example.com/a' }).address).toEqual({
      kind: 'link',
      href: 'https://example.com/a',
    });
    expect(assessOne({ href: 'mailto:hi@example.com' }).address).toEqual({
      kind: 'text',
      text: 'mailto:hi@example.com',
    });
    expect(assessOne({ href: '' }).address).toEqual({
      kind: 'badge',
      badge: { text: 'Empty', tone: 'warn' },
    });
  });
});

describe('links assess: хедер', () => {
  it('лічильники п’яти плиток, нуль вимикає плитку, empty anchor попереджає', () => {
    const { header } = assess(
      linksSnapshot({
        page: 'https://example.com/',
        links: [
          linkEntry(),
          linkEntry({ href: 'https://other.org/', rel: ['nofollow'] }),
          linkEntry({ href: 'mailto:a@b.c', text: '' }),
        ],
      }),
    );
    expect(header.tiles.map((t) => [t.id, t.value, t.tone, t.disabled])).toEqual([
      ['links', '3', 'neutral', false],
      ['internal', '1', 'neutral', false],
      ['external', '1', 'neutral', false],
      ['nofollow', '1', 'neutral', false],
      ['empty-anchor', '1', 'warn', false],
    ]);
  });

  it('без Links усі плитки вимкнені й нейтральні', () => {
    const { header } = assess(linksSnapshot());
    expect(header.tiles.every((t) => t.disabled && t.tone === 'neutral')).toBe(true);
  });
});
