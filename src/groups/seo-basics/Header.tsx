import type { HeaderView } from './assess/header';

/** Хедер: повний URL (тікет #4 додає плитки і діаграму H1–H6). */
export function Header({ header }: { header: HeaderView }) {
  return (
    <div class="bg-surface-2 px-3.5 py-3">
      <span class="block font-mono text-xs wrap-anywhere text-muted" data-testid="url">
        {header.url}
      </span>
    </div>
  );
}
