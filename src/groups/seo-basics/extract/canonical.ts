import { absoluteHref } from './absolute-href';

/** Кожен `<link>` з токеном `canonical` у rel (head і body), у порядку документа. '' = Empty. */
export function extractCanonical(document: Document): string[] {
  return [...document.querySelectorAll('link[rel]')]
    .filter((el) => el.getAttribute('rel')?.toLowerCase().split(/\s+/).includes('canonical'))
    .map(absoluteHref);
}
