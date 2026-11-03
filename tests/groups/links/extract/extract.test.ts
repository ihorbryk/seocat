import { describe, expect, it } from 'vitest';
import { extract } from '../../../../src/groups/links/extract';
import { loadFixture, parseHtml } from '../../../helpers';

describe('links extract', () => {
  it('кожен <a href> у порядку документа, повтори й приховані окремо; <a> без href, <area> і <link> пропущено', () => {
    expect(extract(loadFixture('links-mixed')).links.map((l) => l.href)).toEqual([
      'https://example.com/blog/post',
      'https://example.com/blog/post',
      'https://cdn.example.net/x',
      'mailto:hi@example.com',
      '',
      'https://example.com/blog/#top',
    ]);
  });

  it('текст і alt Images усередині зі стиснутими пробілами; <img> без alt пропущено', () => {
    const links = extract(loadFixture('links-mixed')).links;
    expect(links[0]).toMatchObject({ text: 'Read the post', imageAlts: [] });
    expect(links[2]).toMatchObject({ text: '', imageAlts: ['Partner logo'] });
    expect(links[4]).toMatchObject({ text: '', imageAlts: [] });
  });

  it('токени rel у нижньому регістрі', () => {
    const links = extract(loadFixture('links-mixed')).links;
    expect(links.map((l) => l.rel)).toEqual([
      [],
      ['nofollow', 'noopener'],
      ['sponsored', 'ugc'],
      [],
      [],
      [],
    ]);
  });

  it('будь-яка схема і порожній href — Link, включно з дублікатами', () => {
    const doc = parseHtml(
      `<a href="/a">1</a><a href="/a">2</a><a href="#">3</a><a href="mailto:x@y.z">4</a><a href="javascript:void(0)">5</a><a href="">6</a>`,
    );
    expect(extract(doc).links).toHaveLength(6);
  });

  it('адреса Page — document.URL', () => {
    const doc = parseHtml('<a href="/x">x</a>');
    expect(extract(doc).page).toBe(doc.URL);
  });

  it('Links немає: порожній список', () => {
    expect(extract(parseHtml('<p>text</p>')).links).toEqual([]);
  });
});
