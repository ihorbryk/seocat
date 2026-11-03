import type { PageSnapshot } from '../src/groups/seo-basics/types';

/** Знімок з нульовими лічильниками; тести перекривають лише потрібні поля. */
export function snapshot(over: Partial<PageSnapshot> = {}): PageSnapshot {
  return {
    url: 'https://example.com/',
    title: { count: 1, value: 'Hi' },
    description: { count: 0, value: null },
    words: 0,
    images: 0,
    links: 0,
    headings: [0, 0, 0, 0, 0, 0],
    ...over,
  };
}
