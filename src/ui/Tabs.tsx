import type { ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';

export interface TabItem<Id extends string> {
  id: Id;
  label: string;
}

/**
 * Липкий сегментований перемикач у стилі macOS і панель активної вкладки.
 * ARIA tablist/tab/tabpanel: стрілки ←/→ перемикають по колу, у Tab-порядку лише активна вкладка.
 */
export function Tabs<Id extends string>({
  items,
  active,
  onSelect,
  children,
}: {
  items: readonly TabItem<Id>[];
  active: Id;
  onSelect: (id: Id) => void;
  children: ComponentChildren;
}) {
  const refs = useRef<Partial<Record<Id, HTMLButtonElement | null>>>({});

  function onKeyDown(event: KeyboardEvent, index: number) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const next = items[(index + step + items.length) % items.length]!;
    onSelect(next.id);
    refs.current[next.id]?.focus();
  }

  return (
    <>
      <div class="sticky top-0 z-10 bg-surface-2 px-3.5 pt-1 pb-2">
        <div role="tablist" class="flex rounded-lg bg-line p-0.5">
          {items.map((item, index) => {
            const selected = item.id === active;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  refs.current[item.id] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={selected}
                aria-controls={selected ? `panel-${item.id}` : undefined}
                tabIndex={selected ? 0 : -1}
                onClick={() => onSelect(item.id)}
                onKeyDown={(e) => onKeyDown(e, index)}
                class={`flex-1 rounded-md px-2 py-1 text-xs ${
                  selected ? 'bg-raised font-semibold text-ink shadow-sm' : 'text-muted'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
        {children}
      </div>
    </>
  );
}
