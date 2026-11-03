import type { ContentSnapshot } from '../src/groups/content/types';
import type { IndexingSnapshot } from '../src/groups/indexing/types';
import type { GroupSnapshots, Outcome } from '../src/shared/envelope';

/** Знімок Group Content з нульовими лічильниками; тести перекривають лише потрібні поля. */
export function contentSnapshot(over: Partial<ContentSnapshot> = {}): ContentSnapshot {
  return {
    title: { count: 1, value: 'Hi' },
    description: { count: 0, value: null },
    words: 0,
    images: 0,
    links: 0,
    headings: [0, 0, 0, 0, 0, 0],
    ...over,
  };
}

/** Знімок Group Indexing без тегів; тести перекривають лише потрібні поля. */
export function indexingSnapshot(over: Partial<IndexingSnapshot> = {}): IndexingSnapshot {
  return { canonical: [], robots: [], hreflang: [], ...over };
}

/** Outcome `ok` зі знімками обох Groups. */
export function okOutcome(
  over: { content?: Partial<ContentSnapshot>; indexing?: Partial<IndexingSnapshot> } = {},
): Extract<Outcome, { kind: 'ok' }> {
  const groups: GroupSnapshots = {
    content: contentSnapshot(over.content),
    indexing: indexingSnapshot(over.indexing),
  };
  return { kind: 'ok', groups };
}
