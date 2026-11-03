import type { RowView } from '../../../ui/types';
import type { IndexingSnapshot } from '../types';
import { listRow, listValue } from './list-row';

export function assessHreflang({ hreflang }: IndexingSnapshot): RowView {
  return listRow(
    'hreflang',
    'hreflang',
    hreflang.map((h) => listValue(`${h.code} → `, h.href)),
  );
}
