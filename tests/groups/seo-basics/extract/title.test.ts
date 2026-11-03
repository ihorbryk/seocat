import { describe, expect, it } from 'vitest';
import { extract } from '../../../../src/groups/seo-basics/extract';
import { loadFixture } from '../../../helpers';

describe('seo-basics extract: url', () => {
  it('повертає document.URL як є', () => {
    const doc = loadFixture('title-normal');
    expect(extract(doc).url).toBe(doc.URL);
  });
});

describe('seo-basics extract: title', () => {
  it('обрізає і колапсує пробіли', () => {
    expect(extract(loadFixture('title-normal')).title).toEqual({ count: 1, value: 'Hello world' });
  });
  it('Missing: тегу немає (svg <title> не рахується)', () => {
    expect(extract(loadFixture('title-missing')).title).toEqual({ count: 0, value: null });
  });
  it('Empty: тег є, але порожній після обрізання', () => {
    expect(extract(loadFixture('title-empty')).title).toEqual({ count: 1, value: '' });
  });
  it('Duplicate: кілька тегів, значення першого', () => {
    expect(extract(loadFixture('title-duplicate')).title).toEqual({ count: 2, value: 'First' });
  });
});
