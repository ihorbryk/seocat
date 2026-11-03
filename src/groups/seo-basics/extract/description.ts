import { normalizeText, type TextTag } from './text-tag';

/**
 * Перший `<meta name="description">` (name без урахування регістру) незалежно від `content`;
 * без `content` = Missing. Count рахує всі такі теги.
 */
export function extractDescription(document: Document): TextTag {
  const tags = [...document.querySelectorAll('meta[name]')].filter(
    (el) => el.getAttribute('name')?.toLowerCase() === 'description',
  );
  const content = tags[0]?.getAttribute('content');
  return {
    count: tags.length,
    value: content == null ? null : normalizeText(content),
  };
}
