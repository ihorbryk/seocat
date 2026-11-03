import type { HeaderView } from './assess/header';

/** Хедер (не липкий): URL, плитки words/images/links, діаграма H1–H6. */
export function Header({ header }: { header: HeaderView }) {
  return (
    <div class="bg-surface-2 px-3.5 py-3">
      <span class="block font-mono text-xs wrap-anywhere text-muted" data-testid="url">
        {header.url}
      </span>
      <div class="mt-3 grid grid-cols-3 gap-2">
        {header.tiles.map((t) => (
          <div
            key={t.id}
            data-testid={`tile-${t.id}`}
            class="rounded-md border border-line bg-surface px-2 py-2 text-center"
          >
            <span class="block text-2xl leading-none font-semibold text-ink">{t.value}</span>
            <span class="mt-1 block text-xs text-muted">{t.label}</span>
          </div>
        ))}
      </div>
      <div class="mt-3 flex items-end gap-2">
        {header.headings.map((h) => (
          <div
            key={h.level}
            data-testid={`h${h.level}`}
            data-zero={h.count === 0 ? 'true' : undefined}
            class="flex flex-1 flex-col items-center"
          >
            <span class={`text-xs ${h.count === 0 ? 'text-muted' : 'text-ink'}`}>{h.count}</span>
            <span
              aria-hidden="true"
              class={`my-0.5 w-full rounded-sm ${h.count === 0 ? 'bg-line' : 'bg-accent'}`}
              style={{
                height: h.count === 0 ? '4px' : `${Math.max(4, Math.round(h.ratio * 36))}px`,
              }}
            />
            <span class="text-xs text-muted">H{h.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
