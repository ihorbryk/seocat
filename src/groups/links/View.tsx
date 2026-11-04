import { useState } from 'preact/hooks';
import { matchesSearch } from '../../shared/search';
import { FilterTiles } from '../../ui/FilterTiles';
import { SearchField } from '../../ui/SearchField';
import type { LinkFilter } from './assess/link';
import { LinkRow } from './LinkRow';
import type { LinksView } from './types';

/** Filter і Search живуть лише в стані вкладки: новий попап або інша вкладка їх скидає. */
export function View({ view }: { view: LinksView }) {
  const [filter, setFilter] = useState<LinkFilter | null>(null);
  const [query, setQuery] = useState('');
  const shown = view.links.filter(
    (l) => (filter === null || l.filters.includes(filter)) && matchesSearch(l.search, query),
  );
  return (
    <>
      <FilterTiles tiles={view.header.tiles} filter={filter} onFilter={setFilter} />
      {view.links.length === 0 ? (
        <p class="px-3.5 py-3 text-muted">No links on this page</p>
      ) : (
        <>
          <SearchField value={query} placeholder="Filter links" onInput={setQuery} />
          {shown.length === 0 ? (
            <p class="px-3.5 py-3 text-muted">No links match</p>
          ) : (
            <ul class="m-0 list-none p-0">
              {shown.map((link) => (
                <LinkRow key={link.id} link={link} />
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
