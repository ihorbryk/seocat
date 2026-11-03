import { describe, expect, it } from 'vitest';
import { extract } from '../../../../src/groups/seo-basics/extract';
import { loadFixture, parseHtml } from '../../../helpers';

const desc = (name: string) => extract(loadFixture(name)).description;

describe('seo-basics extract: description', () => {
  it('обрізає і колапсує пробіли', () => {
    expect(desc('description-normal')).toEqual({ count: 1, value: 'Hello world' });
  });
  it('`name` без урахування регістру', () => {
    expect(desc('description-case')).toEqual({ count: 1, value: 'Upper' });
  });
  it('Missing: тегу немає', () => {
    expect(desc('description-missing')).toEqual({ count: 0, value: null });
  });
  it('Missing: тег без атрибута content', () => {
    expect(desc('description-no-content')).toEqual({ count: 1, value: null });
  });
  it('перший тег без content = Missing, навіть якщо другий має content; рахуються обидва', () => {
    const d = parseHtml('<meta name=description><meta name=description content=abc>');
    expect(extract(d).description).toEqual({ count: 2, value: null });
  });
  it('Empty: content порожній після обрізання', () => {
    expect(desc('description-empty')).toEqual({ count: 1, value: '' });
  });
  it('Duplicate: кілька тегів, значення першого', () => {
    expect(desc('description-duplicate')).toEqual({ count: 2, value: 'First' });
  });
});
