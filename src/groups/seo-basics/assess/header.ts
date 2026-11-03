import type { PageSnapshot } from '../types';

export interface TileView {
  id: 'words' | 'images' | 'links';
  /** Число з роздільниками тисяч. */
  value: string;
  label: string;
}

export interface HeadingBarView {
  level: number;
  count: number;
  /** Висота стовпчика, 0..1 відносно максимуму. */
  ratio: number;
}

/** Хедер: URL, три плитки, діаграма H1–H6. */
export interface HeaderView {
  url: string;
  tiles: TileView[];
  headings: HeadingBarView[];
}

const fmt = new Intl.NumberFormat('en-US');

export function assessHeader(snapshot: PageSnapshot): HeaderView {
  const max = Math.max(1, ...snapshot.headings);
  return {
    url: snapshot.url,
    tiles: [
      { id: 'words', value: fmt.format(snapshot.words), label: 'words' },
      { id: 'images', value: fmt.format(snapshot.images), label: 'images' },
      { id: 'links', value: fmt.format(snapshot.links), label: 'links' },
    ],
    headings: snapshot.headings.map((count, i) => ({
      level: i + 1,
      count,
      ratio: count / max,
    })),
  };
}
