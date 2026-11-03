import type { BadgeView } from './types';

const TONES = {
  good: 'text-good bg-good-bg',
  warn: 'text-warn bg-warn-bg',
  bad: 'text-bad bg-bad-bg',
  neutral: 'text-muted bg-surface-2',
} as const;

export function Badge({ badge }: { badge: BadgeView }) {
  return (
    <span
      class={`inline-block rounded px-1.5 py-px text-[11px] font-semibold whitespace-nowrap ${TONES[badge.tone]}`}
    >
      {badge.text}
    </span>
  );
}
