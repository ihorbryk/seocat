import type { FilterTileView, Tone } from '../../../ui/types';
import type { ImageFilter, ImageView } from './image';

export type TileView = FilterTileView<ImageFilter> & { id: 'images' | ImageFilter };

/** Хедер: чотири плитки-фільтри. */
export interface HeaderView {
  tiles: TileView[];
}

const formatCount = new Intl.NumberFormat('en-US');

const FILTERS: { filter: ImageFilter; label: string; tone: Tone }[] = [
  { filter: 'missing-alt', label: 'missing alt', tone: 'warn' },
  { filter: 'empty-alt', label: 'empty alt', tone: 'neutral' },
  { filter: 'heavy', label: '> 1 MB', tone: 'bad' },
];

/** Лічильники рахуються з тих самих `filters`, за якими View фільтрує список. */
export function assessHeader(images: ImageView[]): HeaderView {
  const tile = (
    id: TileView['id'],
    filter: ImageFilter | null,
    label: string,
    count: number,
    tone: Tone,
  ): TileView => ({
    id,
    value: formatCount.format(count),
    label,
    tone: count ? tone : 'neutral',
    filter,
    disabled: count === 0,
  });
  return {
    tiles: [
      tile('images', null, 'images', images.length, 'neutral'),
      ...FILTERS.map(({ filter, label, tone }) =>
        tile(filter, filter, label, images.filter((i) => i.filters.includes(filter)).length, tone),
      ),
    ],
  };
}
