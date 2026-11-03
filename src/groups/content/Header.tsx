import { Tile } from '../../ui/Tile';
import type { HeaderView } from './assess/header';

/** Хедер (не липкий): плитки words/images/links, діаграма H1–H6 (прототип, варіант D). */
export function Header({ header }: { header: HeaderView }) {
  return (
    <div class="bg-surface-2 px-3.5 py-3">
      <div class="grid grid-cols-3 gap-2">
        {header.tiles.map((t) => (
          <Tile key={t.id} id={t.id} value={t.value} label={t.label} />
        ))}
      </div>
      <div class="mt-2 grid h-16 grid-cols-6 items-end gap-1">
        {header.headings.map((h) => (
          <div
            key={h.level}
            data-testid={`h${h.level}`}
            data-zero={h.count === 0 ? 'true' : undefined}
            class="flex h-full flex-col items-center justify-end text-[11px] text-ink"
          >
            <span class="font-bold">{h.count}</span>
            <span
              aria-hidden="true"
              class={`block min-h-0.5 w-[70%] rounded-t-[3px] opacity-80 ${h.count === 0 ? 'bg-line' : 'bg-accent'}`}
              style={{
                height: h.count === 0 ? '2px' : `${Math.max(6, Math.round(h.ratio * 36))}px`,
              }}
            />
            <span class="text-muted">H{h.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
