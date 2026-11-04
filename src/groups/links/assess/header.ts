import type { FilterTileView, Tone } from '../../../ui/types';
import type { LinkFilter, LinkView } from './link';

export type TileView = FilterTileView<LinkFilter> & { id: 'links' | LinkFilter };

/** Хедер: п'ять плиток-фільтрів. */
export interface HeaderView {
  tiles: TileView[];
}

const formatCount = new Intl.NumberFormat('en-US');

const FILTERS: { filter: LinkFilter; label: string; warn?: true }[] = [
  { filter: 'internal', label: 'internal' },
  { filter: 'external', label: 'external' },
  { filter: 'nofollow', label: 'nofollow' },
  { filter: 'empty-anchor', label: 'empty anchor', warn: true },
];

export function assessHeader(links: LinkView[]): HeaderView {
  const tile = (
    id: TileView['id'],
    filter: LinkFilter | null,
    label: string,
    count: number,
    tone: Tone,
  ): TileView => ({
    id,
    value: formatCount.format(count),
    label,
    tone,
    filter,
    disabled: count === 0,
  });
  return {
    tiles: [
      tile('links', null, 'links', links.length, 'neutral'),
      ...FILTERS.map(({ filter, label, warn }) => {
        const count = links.filter((l) => l.filters.includes(filter)).length;
        return tile(filter, filter, label, count, warn && count ? 'warn' : 'neutral');
      }),
    ],
  };
}
