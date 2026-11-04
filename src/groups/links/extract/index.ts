import { absoluteHref } from '../../../shared/absolute-href';
import { readTextAndAlts } from '../../../shared/text-and-alts';
import type { LinkEntry, LinksSnapshot } from '../types';

/** Чисте читання `<a href>` документа верхнього рівня; приховані Links теж (ADR 0003). */
export function extract(document: Document): LinksSnapshot {
  return {
    page: document.URL,
    links: [...document.querySelectorAll('a[href]')].map(extractLink),
  };
}

function extractLink(a: Element): LinkEntry {
  return {
    href: absoluteHref(a),
    ...readTextAndAlts(a),
    rel: (a.getAttribute('rel') ?? '').toLowerCase().split(/\s+/).filter(Boolean),
  };
}
