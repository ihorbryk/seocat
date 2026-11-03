import type { RowView } from '../../../ui/types';
import type { PageSnapshot } from '../types';
import { listRow, listValue } from './list-row';

export function assessCanonical({ canonical }: PageSnapshot): RowView {
  return listRow(
    'canonical',
    'Canonical',
    canonical.map((href) => listValue('', href)),
    { duplicates: true },
  );
}
