import { Header } from './Header';
import { ImageRow } from './ImageRow';
import type { ImagesView } from './types';

export function View({ view }: { view: ImagesView }) {
  return (
    <>
      <Header header={view.header} />
      {view.images.length === 0 ? (
        <p class="px-3.5 py-3 text-muted">No images on this page</p>
      ) : (
        <ul class="m-0 list-none p-0">
          {view.images.map((image) => (
            <ImageRow key={image.id} image={image} />
          ))}
        </ul>
      )}
    </>
  );
}
