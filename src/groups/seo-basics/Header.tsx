import { UrlBlock } from '../../ui/UrlBlock';
import type { HeaderView } from './assess/header';

/** Хедер (не липкий): URL, плитки words/images/links, діаграма H1–H6 (прототип, варіант D). */
export function Header({ header }: { header: HeaderView }) {
  return (
    <div class="bg-surface-2 px-3.5 py-3">
      <UrlBlock url={header.url} />
      <div class="mt-2.5 grid grid-cols-3 gap-2">
        {header.tiles.map((t) => (
          <div
            key={t.id}
            data-testid={`tile-${t.id}`}
            class="rounded-lg bg-surface p-2 text-center"
          >
            <span class="block text-[20px] font-bold text-ink tabular-nums">{t.value}</span>
            <span class="text-[11px] text-muted">{t.label}</span>
          </div>
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
