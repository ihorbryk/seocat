import type { RowView } from '../../../ui/types';
import type { PageSnapshot } from '../types';
import { listRow, listValue } from './list-row';

export function assessHreflang({ hreflang }: PageSnapshot): RowView {
  return listRow(
    'hreflang',
    'hreflang',
    hreflang.map((h) => listValue(`${h.code} → `, h.href)),
  );
}
