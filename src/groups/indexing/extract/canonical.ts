import { absoluteHref } from '../../../shared/absolute-href';
import { hasRelToken } from './rel-token';

/** Кожен `<link>` з токеном `canonical` у rel (head і body), у порядку документа. '' = Empty. */
export function extractCanonical(document: Document): string[] {
  return [...document.querySelectorAll('link[rel]')]
    .filter((el) => hasRelToken(el, 'canonical'))
    .map(absoluteHref);
}
