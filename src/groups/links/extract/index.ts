import { absoluteHref } from '../../../shared/absolute-href';
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
    text: squash(a.textContent ?? ''),
    imageAlts: [...a.querySelectorAll('img[alt]')].map((img) => squash(img.getAttribute('alt')!)),
    rel: (a.getAttribute('rel') ?? '').toLowerCase().split(/\s+/).filter(Boolean),
  };
}

const squash = (text: string) => text.replace(/\s+/g, ' ').trim();
