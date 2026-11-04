import { fireEvent, render, screen, within } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { View } from '../../../src/groups/links/View';
import { assess } from '../../../src/groups/links/assess';
import type { LinkEntry } from '../../../src/groups/links/types';
import { linkEntry, linksSnapshot } from '../../snapshot';

const renderLinks = (...links: Partial<LinkEntry>[]) =>
  render(<View view={assess(linksSnapshot({ links: links.map(linkEntry) }))} />);

const rows = () => screen.queryAllByRole('listitem').map((li) => li.getAttribute('data-testid'));
const tile = (id: string) => screen.getByTestId(`tile-${id}`);

describe('View Links', () => {
  it('плитки хедера: links, internal, external, nofollow, empty anchor', () => {
    renderLinks({}, { href: 'https://other.org/', rel: ['ugc'] }, { text: '' });
    expect(tile('links').textContent).toBe('3links');
    expect(tile('internal').textContent).toBe('2internal');
    expect(tile('external').textContent).toBe('1external');
    expect(tile('nofollow').textContent).toBe('1nofollow');
    expect(tile('empty-anchor').textContent).toBe('1empty anchor');
  });

  it('рядок Link: Anchor text і адреса в новій вкладці', () => {
    renderLinks({ href: 'https://example.com/about', text: 'About us' });
    const row = within(screen.getByTestId('link-0'));
    expect(row.getByText('About us')).toBeTruthy();
    const link = row.getByRole('link', { name: 'https://example.com/about' });
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('External і Nofollow: бейджі поруч з адресою', () => {
    renderLinks({ href: 'https://other.org/', rel: ['nofollow', 'sponsored'] });
    const row = within(screen.getByTestId('link-0'));
    expect(row.getByText('External')).toBeTruthy();
    expect(row.getByText('nofollow')).toBeTruthy();
    expect(row.getByText('sponsored')).toBeTruthy();
  });

  it('посилання-картинка: alt з приміткою img', () => {
    renderLinks({ text: '', imageAlts: ['Logo'] });
    expect(screen.getByTestId('link-0').textContent).toContain('img Logo');
  });

  it('mailto: текстом без посилання; порожні href і Anchor text — Empty', () => {
    renderLinks({ href: 'mailto:hi@example.com' }, { href: '', text: '' });
    expect(within(screen.getByTestId('link-0')).getByText('mailto:hi@example.com')).toBeTruthy();
    expect(within(screen.getByTestId('link-0')).queryByRole('link')).toBeNull();
    expect(within(screen.getByTestId('link-1')).getAllByText('Empty')).toHaveLength(2);
  });

  it('клік по плитці показує лише її Links, повторний клік скидає фільтр', () => {
    renderLinks({}, { href: 'https://other.org/' }, { href: 'https://other.org/b' });
    fireEvent.click(tile('external'));
    expect(rows()).toEqual(['link-1', 'link-2']);
    expect(tile('external').getAttribute('aria-pressed')).toBe('true');
    expect(tile('links').getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(tile('external'));
    expect(rows()).toEqual(['link-0', 'link-1', 'link-2']);
    expect(tile('links').getAttribute('aria-pressed')).toBe('true');
  });

  it('інша плитка перемикає фільтр, плитка links скидає', () => {
    renderLinks({}, { href: 'https://other.org/', rel: ['nofollow'] }, { text: '' });
    fireEvent.click(tile('internal'));
    fireEvent.click(tile('empty-anchor'));
    expect(rows()).toEqual(['link-2']);
    expect(tile('internal').getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(tile('links'));
    expect(rows()).toEqual(['link-0', 'link-1', 'link-2']);
  });

  it('плитка з нулем вимкнена', () => {
    renderLinks({});
    expect((tile('external') as HTMLButtonElement).disabled).toBe(true);
    expect((tile('internal') as HTMLButtonElement).disabled).toBe(false);
  });

  it('Links немає: повідомлення замість списку', () => {
    renderLinks();
    expect(screen.getByText('No links on this page')).toBeTruthy();
  });

  describe('Search', () => {
    const search = () => screen.getByRole('searchbox', { name: 'Filter links' });
    const type = (text: string) => fireEvent.input(search(), { target: { value: text } });

    it('звужує список за Anchor text і адресою, без урахування регістру', () => {
      renderLinks(
        { text: 'Pricing', href: 'https://example.com/a' },
        { text: 'Home', href: 'https://example.com/PRICING' },
        { text: 'About' },
      );
      type('pricing');
      expect(rows()).toEqual(['link-0', 'link-1']);
    });

    it('alt Image усередині Link — це Anchor text', () => {
      renderLinks({ text: '', imageAlts: ['Logo'] }, {});
      type('logo');
      expect(rows()).toEqual(['link-0']);
    });

    it('знаходить декодовану адресу; битий escape лишає сиру', () => {
      renderLinks(
        { href: 'https://uk.wikipedia.org/wiki/%D0%9A%D0%B8%D1%97%D0%B2' },
        { href: 'https://example.com/%E0%A4%A' },
      );
      type('київ');
      expect(rows()).toEqual(['link-0']);
      type('%e0%a4');
      expect(rows()).toEqual(['link-1']);
    });

    it('бейджі External, nofollow і Empty не шукаються', () => {
      renderLinks({ href: 'https://other.org/', rel: ['nofollow'] }, { text: '' });
      type('external');
      expect(rows()).toEqual([]);
      type('nofollow');
      expect(rows()).toEqual([]);
      type('empty');
      expect(rows()).toEqual([]);
    });

    it('поєднується з Filter, а лічильники плиток не змінює', () => {
      renderLinks(
        { href: 'https://other.org/blog' },
        { href: 'https://other.org/shop' },
        { href: 'https://example.com/blog' },
      );
      fireEvent.click(tile('external'));
      type('blog');
      expect(rows()).toEqual(['link-0']);
      expect(tile('external').textContent).toBe('2external');
    });

    it('нічого не знайдено: повідомлення, поле лишається; Escape очищає', () => {
      renderLinks({});
      type('zzz');
      expect(screen.getByText('No links match')).toBeTruthy();
      fireEvent.keyDown(search(), { key: 'Escape' });
      expect((search() as HTMLInputElement).value).toBe('');
      expect(rows()).toEqual(['link-0']);
    });
  });
});
