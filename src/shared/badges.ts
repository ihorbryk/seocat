import type { BadgeView } from '../ui/types';

/** Бейджі станів з `GLOSSARY.md`; усі Metrics беруть їх лише звідси. */
export const MISSING: BadgeView = { text: 'Missing', tone: 'warn' };
export const EMPTY: BadgeView = { text: 'Empty', tone: 'warn' };

/** Duplicate: тег, якого очікують один, трапився `count` разів. */
export function duplicate(count: number): BadgeView {
  return { text: `Duplicate ×${count}`, tone: 'warn' };
}

/** Empty alt: `alt=""` — правильна розмітка декоративного Image, тож без попередження. */
export const EMPTY_ALT: BadgeView = { ...EMPTY, tone: 'neutral' };

/** Стани Image з `GLOSSARY.md`: інформація, а не проблема, тому без попередження. */
export const NOT_LOADED: BadgeView = { text: 'Not loaded', tone: 'neutral' };
export const SIZE_UNKNOWN: BadgeView = { text: 'Size unknown', tone: 'neutral' };

/** External і значення `rel` Nofollow з `GLOSSARY.md`: факти про Link, а не проблема. */
export const EXTERNAL: BadgeView = { text: 'External', tone: 'neutral' };
export function rel(token: string): BadgeView {
  return { text: token, tone: 'neutral' };
}
