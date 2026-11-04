import type { ContentSnapshot } from '../types';
import { extractHeadings } from './headings';
import { extractDescription } from './description';
import { extractTitle } from './title';
import { extractWords } from './words';

/** Чисте читання DOM. Один виклик на Metric; нові Metrics додають по одному рядку. */
export function extract(document: Document): ContentSnapshot {
  return {
    title: extractTitle(document),
    description: extractDescription(document),
    words: extractWords(document),
    headings: extractHeadings(document),
  };
}
