import type { ContentSnapshot } from '../src/groups/content/types';
import type { IndexingSnapshot } from '../src/groups/indexing/types';
import type { GroupId, GroupSnapshots } from '../src/groups/page-registry';
import type { Outcome } from '../src/extract/envelope';

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

type Overrides = { [Id in GroupId]?: Partial<GroupSnapshots[Id]> };

/** По фабриці на кожну Group з `page-registry`: нова Group без фабрики не збереться. */
const factories: { [Id in GroupId]: (over?: Partial<GroupSnapshots[Id]>) => GroupSnapshots[Id] } = {
  content: contentSnapshot,
  indexing: indexingSnapshot,
};

/** Outcome `ok` зі знімками всіх Groups. */
export function okOutcome(over: Overrides = {}): Extract<Outcome, { kind: 'ok' }> {
  const groups = Object.fromEntries(
    Object.entries(factories).map(([id, make]) => [id, make(over[id as GroupId] as never)]),
  ) as unknown as GroupSnapshots;
  return { kind: 'ok', groups };
}
