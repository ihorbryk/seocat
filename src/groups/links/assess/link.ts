import { EMPTY, EXTERNAL, rel } from '../../../shared/badges';
import { searchTexts } from '../../../shared/search';
import { textOrAlt, type TextOrAltView } from '../../../shared/text-or-alt';
import type { BadgeView } from '../../../ui/types';
import type { LinkEntry } from '../types';

/** Плитка хедера, що показує лише свої Links. */
export type LinkFilter = 'internal' | 'external' | 'nofollow' | 'empty-anchor';

/** Клікабельна веб-адреса, адреса іншої схеми без посилання або Empty. */
export type AddressView =
  | { kind: 'link'; href: string }
  | { kind: 'text'; text: string }
  | { kind: 'badge'; badge: BadgeView };

export interface LinkView {
  id: string;
  /** Anchor text: текст, alt Image усередині (з приміткою `img`) або Empty. */
  anchor: TextOrAltView;
  address: AddressView;
  /** External і значення `rel` з Nofollow поруч з адресою. */
  badges: BadgeView[];
  /** Фільтри, під які потрапляє Link. */
  filters: LinkFilter[];
  /** Рядки для Search: Anchor text і адреса, без бейджів. */
  search: string[];
}

/** Значення `rel`, що роблять Link Nofollow (`GLOSSARY.md`). */
const NOFOLLOW = ['nofollow', 'sponsored', 'ugc'];

export function assessLink(link: LinkEntry, index: number, pageHost: string | null): LinkView {
  const scope = scopeOf(link.href, pageHost);
  const nofollow = NOFOLLOW.filter((token) => link.rel.includes(token));
  const anchor = textOrAlt(link);
  const filters: LinkFilter[] = [];
  if (scope) filters.push(scope);
  if (nofollow.length) filters.push('nofollow');
  if (anchor.kind === 'badge') filters.push('empty-anchor');
  return {
    id: `link-${index}`,
    anchor,
    address: assessAddress(link.href),
    badges: [...(scope === 'external' ? [EXTERNAL] : []), ...nofollow.map(rel)],
    filters,
    search: searchTexts({
      texts: [anchor.kind === 'badge' ? '' : anchor.text],
      addresses: [link.href],
    }),
  };
}

/** Host веб-адреси без префікса `www.`; null для інших схем і нерозбірних адрес. */
export function siteHost(url: string): string | null {
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== 'http:' && protocol !== 'https:') return null;
    return hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/** Порожній `href` веде на саму Page, тож він Internal. */
function scopeOf(href: string, pageHost: string | null): 'internal' | 'external' | null {
  if (href === '') return 'internal';
  const host = siteHost(href);
  if (host === null) return null;
  return host === pageHost ? 'internal' : 'external';
}

function assessAddress(href: string): AddressView {
  if (href === '') return { kind: 'badge', badge: EMPTY };
  // Safari не відкриває `mailto:`, `tel:` і `javascript:` у новій вкладці.
  if (siteHost(href) === null) return { kind: 'text', text: href };
  return { kind: 'link', href };
}
