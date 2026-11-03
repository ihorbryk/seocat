import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Розбирає HTML-рядок у Document (jsdom). */
export function parseHtml(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html');
}

/** Читає tests/fixtures/<name>.html і розбирає в Document. */
export function loadFixture(name: string): Document {
  return parseHtml(readFileSync(resolve(import.meta.dirname, 'fixtures', `${name}.html`), 'utf8'));
}
