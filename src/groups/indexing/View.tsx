import { Table } from '../../ui/Table';
import type { IndexingView } from './types';

export function View({ view }: { view: IndexingView }) {
  return <Table sections={view.sections} />;
}
