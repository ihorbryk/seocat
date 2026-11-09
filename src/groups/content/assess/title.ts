import type { RowView } from '../../../ui/types';
import type { ContentSnapshot } from '../types';
import { textTagBadges } from './length';

/** Length rating для title: Short < 30, Good 30–60, Long > 60. */
export const TITLE_RANGE = { min: 30, max: 60 };

export function assessTitle({ title }: ContentSnapshot): RowView {
  return {
    id: 'title',
    label: 'Title',
    badges: textTagBadges(title, TITLE_RANGE),
    values: title.value ? [{ kind: 'text', text: title.value, copy: title.value }] : [],
  };
}
