import { SectionTitle } from '../../ui/SectionTitle';
import { TextOrAlt } from '../../ui/TextOrAlt';
import type { HeadingView } from './assess/outline';

/** Відступ за абсолютним рівнем: пропущений рівень видно як зайвий крок. */
const INDENT = ['', 'pl-2.5', 'pl-6', 'pl-9.5', 'pl-13', 'pl-16.5', 'pl-20'];

/** Секція Outline: кожен Heading одним рядком, повний текст у `title`. */
export function Outline({ headings }: { headings: HeadingView[] }) {
  return (
    <section>
      <SectionTitle title="Outline" />
      {headings.length === 0 ? (
        <p class="m-0 px-2.5 py-3 text-muted">No headings on this page</p>
      ) : (
        <ul class="m-0 list-none p-0">
          {headings.map((h) => (
            <li
              key={h.id}
              data-testid={h.id}
              data-level={h.level}
              title={h.text.kind === 'badge' ? undefined : h.text.text}
              class={`flex items-baseline gap-2 border-b border-line py-1.5 pr-2.5 ${INDENT[h.level]}`}
            >
              <span class="shrink-0 font-mono text-xs text-muted">H{h.level}</span>
              <span class="min-w-0 truncate text-ink">
                <TextOrAlt value={h.text} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
