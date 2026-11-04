import { readTextAndAlts } from '../../../shared/text-and-alts';
import type { HeadingEntry } from '../types';

/** Кожен `<h1>`–`<h6>` у порядку документа; порожні й приховані враховуються (ADR 0003). */
export function extractHeadings(document: Document): HeadingEntry[] {
  return [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) => ({
    level: Number(h.tagName[1]),
    ...readTextAndAlts(h),
  }));
}
