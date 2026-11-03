import { Header } from './Header';
import { Table } from '../../ui/Table';
import type { GroupView } from './types';

export function View({ view }: { view: GroupView }) {
  return (
    <>
      <Header header={view.header} />
      <Table sections={view.sections} />
    </>
  );
}
