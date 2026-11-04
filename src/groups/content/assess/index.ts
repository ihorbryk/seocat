import type { ContentSnapshot, ContentView } from '../types';
import { assessDescription } from './description';
import { assessHeader } from './header';
import { assessOutline } from './outline';
import { assessTitle } from './title';

/** Чиста функція без DOM. Нові Metrics додають один рядок у відповідну секцію. */
export function assess(snapshot: ContentSnapshot): ContentView {
  return {
    header: assessHeader(snapshot),
    sections: [
      {
        id: 'meta',
        title: 'Meta',
        rows: [assessTitle(snapshot), assessDescription(snapshot)],
      },
    ],
    outline: assessOutline(snapshot),
  };
}
