import type { Tone } from './types';

const TONES = {
  good: 'text-good',
  warn: 'text-warn',
  bad: 'text-bad',
  neutral: 'text-ink',
} as const;

/**
 * Плитка хедера Group: велике число і підпис під ним; `tone` фарбує число.
 * З `onClick` плитка стає кнопкою-фільтром: `pressed` підсвічує активну, `disabled` вимикає.
 */
export function Tile({
  id,
  value,
  label,
  tone = 'neutral',
  pressed,
  disabled,
  onClick,
}: {
  id: string;
  value: string;
  label: string;
  tone?: Tone;
  pressed?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const body = (
    <>
      <span class={`block text-[20px] font-bold tabular-nums ${TONES[tone]}`}>{value}</span>
      <span class="block text-[11px] whitespace-nowrap text-muted">{label}</span>
    </>
  );
  const box = 'rounded-lg bg-surface py-2 text-center';
  if (!onClick) {
    return (
      <div data-testid={`tile-${id}`} class={`${box} px-2`}>
        {body}
      </div>
    );
  }
  return (
    <button
      type="button"
      data-testid={`tile-${id}`}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      class={`${box} border-0 px-1 font-[inherit] ${pressed ? 'ring-2 ring-accent ring-inset' : ''} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
    >
      {body}
    </button>
  );
}
