import { useState } from 'preact/hooks';
import { matchesSearch } from '../../shared/search';
import { FilterTiles } from '../../ui/FilterTiles';
import { SearchField } from '../../ui/SearchField';
import type { ImageFilter } from './assess/image';
import { ImageRow } from './ImageRow';
import type { ImagesView } from './types';

/** Filter і Search живуть лише в стані вкладки: новий попап або інша вкладка їх скидає. */
export function View({ view }: { view: ImagesView }) {
  const [filter, setFilter] = useState<ImageFilter | null>(null);
  const [query, setQuery] = useState('');
  const shown = view.images.filter(
    (i) => (filter === null || i.filters.includes(filter)) && matchesSearch(i.search, query),
  );
  return (
    <>
      <FilterTiles tiles={view.header.tiles} filter={filter} onFilter={setFilter} />
      {view.images.length === 0 ? (
        <p class="px-3.5 py-3 text-muted">No images on this page</p>
      ) : (
        <>
          <SearchField value={query} placeholder="Filter images" onInput={setQuery} />
          {shown.length === 0 ? (
            <p class="px-3.5 py-3 text-muted">No images match</p>
          ) : (
            <ul class="m-0 list-none p-0">
              {shown.map((image) => (
                <ImageRow key={image.id} image={image} />
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
