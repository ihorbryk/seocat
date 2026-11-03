import { Tile } from '../../ui/Tile';
import type { HeaderView } from './assess/header';

/** Хедер (не липкий): плитки Total, Missing alt, Empty alt, > 1 MB. */
export function Header({ header }: { header: HeaderView }) {
  return (
    <div class="grid grid-cols-4 gap-2 bg-surface-2 px-3.5 py-3">
      {header.tiles.map((t) => (
        <Tile key={t.id} {...t} />
      ))}
    </div>
  );
}
