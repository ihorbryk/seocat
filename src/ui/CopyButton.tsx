import { useEffect, useRef, useState } from 'preact/hooks';

type CopyState = 'idle' | 'copied' | 'failed';

/** Скільки тримається галочка або хрестик після кліку. */
const FEEDBACK_MS = 1500;

const LABELS = { idle: 'Copy', copied: 'Copied', failed: 'Copy failed' } as const;
const TONES = {
  idle: 'text-muted hover:text-ink',
  copied: 'text-good',
  failed: 'text-warn',
} as const;

/** Кнопка-іконка: кладе `text` у буфер обміну і на 1,5 с показує галочку або хрестик. */
export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function show(next: CopyState) {
    setState(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), FEEDBACK_MS);
  }

  function copy() {
    // `async` перетворює синхронний виняток (буфера обміну немає) на відхилений Promise.
    (async () => navigator.clipboard.writeText(text))().then(
      () => show('copied'),
      () => show('failed'),
    );
  }

  return (
    <button
      type="button"
      aria-label={LABELS[state]}
      title={LABELS[state]}
      onClick={copy}
      class={`-my-px ml-1 inline-flex size-4 cursor-pointer items-center justify-center rounded align-[-3px] ${TONES[state]}`}
    >
      <svg
        viewBox="0 0 16 16"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        {state === 'copied' ? (
          <path d="M3 8.5l3 3 7-7" />
        ) : state === 'failed' ? (
          <path d="M4 4l8 8M12 4l-8 8" />
        ) : (
          <>
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
            <path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" />
          </>
        )}
      </svg>
    </button>
  );
}
