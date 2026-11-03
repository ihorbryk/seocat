import type { Tone } from '../../../ui/types';
import type { ImagesSnapshot } from '../types';
import { isHeavy } from './bytes';

export interface TileView {
  id: 'total' | 'missing-alt' | 'empty-alt' | 'heavy';
  /** Число з роздільниками тисяч. */
  value: string;
  label: string;
  /** Колір числа. */
  tone: Tone;
}

/** Хедер: чотири плитки. */
export interface HeaderView {
  tiles: TileView[];
}

const formatCount = new Intl.NumberFormat('en-US');

export function assessHeader({ images }: ImagesSnapshot): HeaderView {
  const missingAlt = images.filter((i) => i.alt === null).length;
  const emptyAlt = images.filter((i) => i.alt === '').length;
  const heavy = images.filter(isHeavy).length;
  return {
    tiles: [
      { id: 'total', value: formatCount.format(images.length), label: 'images', tone: 'neutral' },
      {
        id: 'missing-alt',
        value: formatCount.format(missingAlt),
        label: 'missing alt',
        tone: missingAlt ? 'warn' : 'neutral',
      },
      { id: 'empty-alt', value: formatCount.format(emptyAlt), label: 'empty alt', tone: 'neutral' },
      {
        id: 'heavy',
        value: formatCount.format(heavy),
        label: '> 1 MB',
        tone: heavy ? 'bad' : 'neutral',
      },
    ],
  };
}
