import { useState } from 'preact/hooks';
import type { LinkFilter } from './assess/link';
import { Header } from './Header';
import { LinkRow } from './LinkRow';
import type { LinksView } from './types';

/** Фільтр живе лише в стані вкладки: новий попап або інша вкладка його скидає. */
export function View({ view }: { view: LinksView }) {
  const [filter, setFilter] = useState<LinkFilter | null>(null);
  const shown = filter === null ? view.links : view.links.filter((l) => l.filters.includes(filter));
  return (
    <>
      <Header header={view.header} filter={filter} onFilter={setFilter} />
      {view.links.length === 0 ? (
        <p class="px-3.5 py-3 text-muted">No links on this page</p>
      ) : (
        <ul class="m-0 list-none p-0">
          {shown.map((link) => (
            <LinkRow key={link.id} link={link} />
          ))}
        </ul>
      )}
    </>
  );
}
