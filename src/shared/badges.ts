import type { BadgeView } from '../ui/types';

/** Бейджі станів з `GLOSSARY.md`; усі Metrics беруть їх лише звідси. */
export const MISSING: BadgeView = { text: 'Missing', tone: 'warn' };
export const EMPTY: BadgeView = { text: 'Empty', tone: 'warn' };

/** Duplicate: тег, якого очікують один, трапився `count` разів. */
export function duplicate(count: number): BadgeView {
  return { text: `Duplicate ×${count}`, tone: 'warn' };
}
