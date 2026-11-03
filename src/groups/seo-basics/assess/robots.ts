import type { RowView } from '../../../ui/types';
import type { PageSnapshot } from '../types';
import { listRow, listValue } from './list-row';

export function assessRobots({ robots }: PageSnapshot): RowView {
  return listRow(
    'robots',
    'Robots',
    robots.map((r) => listValue(`${r.name}: `, r.content)),
  );
}
