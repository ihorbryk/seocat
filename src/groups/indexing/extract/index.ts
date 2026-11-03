import type { IndexingSnapshot } from '../types';
import { extractCanonical } from './canonical';
import { extractHreflang } from './hreflang';
import { extractRobots } from './robots';

/** Чисте читання DOM. Один виклик на Metric; нові Metrics додають по одному рядку. */
export function extract(document: Document): IndexingSnapshot {
  return {
    canonical: extractCanonical(document),
    robots: extractRobots(document),
    hreflang: extractHreflang(document),
  };
}
