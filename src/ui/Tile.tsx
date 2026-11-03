import type { Tone } from './types';

const TONES = {
  good: 'text-good',
  warn: 'text-warn',
  bad: 'text-bad',
  neutral: 'text-ink',
} as const;

/** Плитка хедера Group: велике число і підпис під ним; `tone` фарбує число. */
export function Tile({
  id,
  value,
  label,
  tone = 'neutral',
}: {
  id: string;
  value: string;
  label: string;
  tone?: Tone;
}) {
  return (
    <div data-testid={`tile-${id}`} class="rounded-lg bg-surface p-2 text-center">
      <span class={`block text-[20px] font-bold tabular-nums ${TONES[tone]}`}>{value}</span>
      <span class="text-[11px] text-muted">{label}</span>
    </div>
  );
}
