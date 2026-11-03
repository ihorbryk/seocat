import type { RowView } from '../../../ui/types';
import type { PageSnapshot } from '../types';
import { textTagBadges } from './length';

/** Length rating для description: Short < 70, Good 70–160, Long > 160. */
export const DESCRIPTION_RANGE = { min: 70, max: 160 };

export function assessDescription({ description }: PageSnapshot): RowView {
  return {
    id: 'description',
    label: 'Description',
    badges: textTagBadges(description, DESCRIPTION_RANGE),
    values: description.value ? [{ kind: 'text', text: description.value }] : [],
  };
}
