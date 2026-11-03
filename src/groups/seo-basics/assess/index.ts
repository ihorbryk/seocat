import type { GroupView, PageSnapshot } from '../types';
import { assessHeader } from './header';
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
    ],
  };
}
