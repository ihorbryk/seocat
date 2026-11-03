import type { PageSnapshot } from '../types';
import { extractTitle } from './title';

/** Чисте читання DOM. Один виклик на Metric; нові Metrics додають по одному рядку. */
export function extract(document: Document): PageSnapshot {
  return {
    url: document.URL,
    title: extractTitle(document),
  };
}
