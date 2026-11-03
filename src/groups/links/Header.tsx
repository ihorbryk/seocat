import { Tile } from '../../ui/Tile';
import type { HeaderView } from './assess/header';
import type { LinkFilter } from './assess/link';

/**
 * Хедер (не липкий): плитки-фільтри links, internal, external, nofollow, empty anchor.
 * Повторний клік по активній плитці або плитка links скидає фільтр.
 */
export function Header({
  header,
  filter,
  onFilter,
}: {
  header: HeaderView;
  filter: LinkFilter | null;
  onFilter: (filter: LinkFilter | null) => void;
}) {
  return (
    <div class="grid grid-cols-5 gap-2 bg-surface-2 px-3.5 py-3">
      {header.tiles.map((t) => (
        <Tile
          key={t.id}
          id={t.id}
          value={t.value}
          label={t.label}
          tone={t.tone}
          pressed={t.filter === filter}
          disabled={t.disabled}
          onClick={() => onFilter(t.filter === filter ? null : t.filter)}
        />
      ))}
    </div>
  );
}
