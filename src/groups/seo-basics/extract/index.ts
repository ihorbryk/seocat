import type { PageSnapshot } from '../types';
import { extractCanonical } from './canonical';
import { extractHreflang } from './hreflang';
import { extractRobots } from './robots';
import { extractDescription } from './description';
import { extractTitle } from './title';

/** Чисте читання DOM. Один виклик на Metric; нові Metrics додають по одному рядку. */
export function extract(document: Document): PageSnapshot {
  return {
    url: document.URL,
    title: extractTitle(document),
    canonical: extractCanonical(document),
    robots: extractRobots(document),
    hreflang: extractHreflang(document),
    description: extractDescription(document),
  };
}
