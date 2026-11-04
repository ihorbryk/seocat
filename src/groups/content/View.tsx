import { Header } from './Header';
import { Outline } from './Outline';
import { Table } from '../../ui/Table';
import type { ContentView } from './types';

export function View({ view }: { view: ContentView }) {
  return (
    <>
      <Header header={view.header} />
      <Table sections={view.sections} divided />
      <Outline headings={view.outline} />
    </>
  );
}
