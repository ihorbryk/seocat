import type { IndexingSnapshot, IndexingView } from '../types';
import { assessCanonical } from './canonical';
import { assessHreflang } from './hreflang';
import { assessRobots } from './robots';

/** Чиста функція без DOM. Нові Metrics додають один рядок у відповідну секцію. */
export function assess(snapshot: IndexingSnapshot): IndexingView {
  return {
    sections: [
      {
        id: 'indexing',
        title: 'Indexing',
        rows: [assessCanonical(snapshot), assessRobots(snapshot), assessHreflang(snapshot)],
      },
    ],
  };
}
