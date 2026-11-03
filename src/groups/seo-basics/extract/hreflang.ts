import type { HreflangEntry } from '../types';
import { absoluteHref } from './absolute-href';

/** Кожен `<link rel="alternate" hreflang>`: код як є, href абсолютний ('' = Empty). */
export function extractHreflang(document: Document): HreflangEntry[] {
  return [...document.querySelectorAll('link[rel][hreflang]')]
    .filter((el) => el.getAttribute('rel')?.toLowerCase().split(/\s+/).includes('alternate'))
    .map((el) => ({ code: el.getAttribute('hreflang') ?? '', href: absoluteHref(el) }));
}
