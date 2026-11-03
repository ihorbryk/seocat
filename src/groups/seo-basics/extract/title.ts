import { normalizeText, type TextTag } from './text-tag';

const HTML_NS = 'http://www.w3.org/1999/xhtml';

/** Усі HTML `<title>` у документі (svg `<title>` не рахується). */
export function extractTitle(document: Document): TextTag {
  const tags = [...document.querySelectorAll('title')].filter((el) => el.namespaceURI === HTML_NS);
  const first = tags[0];
  return { count: tags.length, value: first ? normalizeText(first.textContent ?? '') : null };
}
