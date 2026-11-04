import { useState } from 'preact/hooks';
import { FilterTiles } from '../../ui/FilterTiles';
import type { ImageFilter } from './assess/image';
import { ImageRow } from './ImageRow';
import type { ImagesView } from './types';

/** Фільтр живе лише в стані вкладки: новий попап або інша вкладка його скидає. */
export function View({ view }: { view: ImagesView }) {
  const [filter, setFilter] = useState<ImageFilter | null>(null);
  const shown =
    filter === null ? view.images : view.images.filter((i) => i.filters.includes(filter));
  return (
    <>
      <FilterTiles tiles={view.header.tiles} filter={filter} onFilter={setFilter} />
      {view.images.length === 0 ? (
        <p class="px-3.5 py-3 text-muted">No images on this page</p>
      ) : (
        <ul class="m-0 list-none p-0">
          {shown.map((image) => (
            <ImageRow key={image.id} image={image} />
          ))}
        </ul>
      )}
    </>
  );
}
