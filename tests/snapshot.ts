import type { ContentSnapshot } from '../src/groups/content/types';
import type { ImageEntry, ImagesSnapshot } from '../src/groups/images/types';
import type { LinkEntry, LinksSnapshot } from '../src/groups/links/types';
import type { IndexingSnapshot } from '../src/groups/indexing/types';
import type { GroupId, GroupSnapshots } from '../src/groups/page-registry';
import type { Outcome } from '../src/extract/envelope';

/** Знімок Group Content з нульовими лічильниками; тести перекривають лише потрібні поля. */
export function contentSnapshot(over: Partial<ContentSnapshot> = {}): ContentSnapshot {
  return {
    title: { count: 1, value: 'Hi' },
    description: { count: 0, value: null },
    words: 0,
    links: 0,
    headings: [0, 0, 0, 0, 0, 0],
    ...over,
  };
}

/** Знімок Group Indexing без тегів; тести перекривають лише потрібні поля. */
export function indexingSnapshot(over: Partial<IndexingSnapshot> = {}): IndexingSnapshot {
  return { canonical: [], robots: [], hreflang: [], ...over };
}

/** Знімок Group Images без Images; тести перекривають лише потрібні поля. */
export function imagesSnapshot(over: Partial<ImagesSnapshot> = {}): ImagesSnapshot {
  return { images: [], ...over };
}

/** Завантажений Image з alt і відомою вагою; тести перекривають лише потрібні поля. */
export function imageEntry(over: Partial<ImageEntry> = {}): ImageEntry {
  return {
    src: 'https://example.com/a.png',
    alt: 'A',
    natural: { width: 100, height: 50 },
    bytes: 1000,
    ...over,
  };
}

/** Знімок Group Links без Links на `https://example.com/`; тести перекривають лише потрібні поля. */
export function linksSnapshot(over: Partial<LinksSnapshot> = {}): LinksSnapshot {
  return { page: 'https://example.com/', links: [], ...over };
}

/** Internal Link з текстом і без `rel`; тести перекривають лише потрібні поля. */
export function linkEntry(over: Partial<LinkEntry> = {}): LinkEntry {
  return { href: 'https://example.com/about', text: 'About', imageAlts: [], rel: [], ...over };
}

type Overrides = { [Id in GroupId]?: Partial<GroupSnapshots[Id]> };

/** По фабриці на кожну Group з `page-registry`: нова Group без фабрики не збереться. */
const factories: { [Id in GroupId]: (over?: Partial<GroupSnapshots[Id]>) => GroupSnapshots[Id] } = {
  content: contentSnapshot,
  indexing: indexingSnapshot,
  images: imagesSnapshot,
  links: linksSnapshot,
};

/** Outcome `ok` зі знімками всіх Groups. */
export function okOutcome(over: Overrides = {}): Extract<Outcome, { kind: 'ok' }> {
  const groups = Object.fromEntries(
    Object.entries(factories).map(([id, make]) => [id, make(over[id as GroupId] as never)]),
  ) as unknown as GroupSnapshots;
  return { kind: 'ok', groups };
}
