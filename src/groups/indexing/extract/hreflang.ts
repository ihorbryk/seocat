import type { HreflangEntry } from '../types';
import { absoluteHref } from '../../../shared/absolute-href';
import { hasRelToken } from './rel-token';

/** Кожен `<link rel="alternate" hreflang>`: код як є, href абсолютний ('' = Empty). */
export function extractHreflang(document: Document): HreflangEntry[] {
  return [...document.querySelectorAll('link[rel][hreflang]')]
    .filter((el) => hasRelToken(el, 'alternate'))
    .map((el) => ({ code: el.getAttribute('hreflang') ?? '', href: absoluteHref(el) }));
}
