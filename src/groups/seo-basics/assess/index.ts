import type { GroupView, PageSnapshot } from '../types';
import { assessCanonical } from './canonical';
import { assessHeader } from './header';
import { assessHreflang } from './hreflang';
import { assessRobots } from './robots';
import { assessTitle } from './title';

/** Чиста функція без DOM. Нові Metrics додають один рядок у відповідну секцію. */
export function assess(snapshot: PageSnapshot): GroupView {
  return {
    header: assessHeader(snapshot),
    sections: [
      {
        id: 'meta',
        title: 'Meta',
        rows: [assessTitle(snapshot)],
      },
      {
        id: 'indexing',
        title: 'Indexing',
        rows: [assessCanonical(snapshot), assessRobots(snapshot), assessHreflang(snapshot)],
      },
    ],
  };
}
