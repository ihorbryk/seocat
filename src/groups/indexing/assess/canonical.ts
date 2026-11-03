import type { RowView } from '../../../ui/types';
import type { IndexingSnapshot } from '../types';
import { listRow, listValue } from './list-row';

export function assessCanonical({ canonical }: IndexingSnapshot): RowView {
  return listRow(
    'canonical',
    'Canonical',
    canonical.map((href) => listValue('', href)),
    { duplicates: true },
  );
}
