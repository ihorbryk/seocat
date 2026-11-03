import { normalizeText, type TextTag } from './text-tag';

/** Перший `<meta name="description">` (name без урахування регістру); без `content` = Missing. */
export function extractDescription(document: Document): TextTag {
  const tags = [...document.querySelectorAll('meta[name]')].filter(
    (el) => el.getAttribute('name')?.toLowerCase() === 'description' && el.hasAttribute('content'),
  );
  const first = tags[0];
  return {
    count: tags.length,
    value: first ? normalizeText(first.getAttribute('content') ?? '') : null,
  };
}
