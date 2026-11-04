import { Tile } from './Tile';
import type { FilterTileView } from './types';

/**
 * Хедер Group (не липкий) з плиток-фільтрів. Одночасно активний один фільтр:
 * клік по іншій плитці перемикає, повторний клік по активній або плитка з `filter: null` скидає.
 * Стан фільтра тримає View Group.
 */
export function FilterTiles<F extends string>({
  tiles,
  filter,
  onFilter,
}: {
  tiles: FilterTileView<F>[];
  filter: F | null;
  onFilter: (filter: F | null) => void;
}) {
  return (
    // Колонка на плитку; клас `grid-cols-N` Tailwind не згенерує з динамічного N.
    <div
      class="grid gap-2 bg-surface-2 px-3.5 py-3"
      style={{ gridTemplateColumns: `repeat(${tiles.length}, minmax(0, 1fr))` }}
    >
      {tiles.map((t) => (
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
