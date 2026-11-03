import { EMPTY_ALT, MISSING, NOT_LOADED, SIZE_UNKNOWN } from '../../../shared/badges';
import type { BadgeView } from '../../../ui/types';
import type { ImageEntry } from '../types';
import { formatBytes, isHeavy } from './bytes';

export type AltView = { kind: 'text'; text: string } | { kind: 'badge'; badge: BadgeView };

/** Клікабельна адреса, скорочений `data:` без посилання або Missing. */
export type LinkView =
  | { kind: 'link'; href: string }
  | { kind: 'data'; text: string }
  | { kind: 'badge'; badge: BadgeView };

export type SizeView =
  { kind: 'text'; text: string; heavy: boolean } | { kind: 'badge'; badge: BadgeView };

/** Розміри й вага завантаженого файлу або Not loaded. */
export type FileView =
  { kind: 'loaded'; dimensions: string; size: SizeView } | { kind: 'badge'; badge: BadgeView };

export interface ImageView {
  id: string;
  /** Адреса для прев'ю в попапі; null = адреси немає. */
  preview: string | null;
  alt: AltView;
  link: LinkView;
  file: FileView;
}

export function assessImage(image: ImageEntry, index: number): ImageView {
  return {
    id: `image-${index}`,
    preview: image.src || null,
    alt: assessAlt(image.alt),
    link: assessLink(image.src),
    file: assessFile(image),
  };
}

function assessAlt(alt: string | null): AltView {
  if (alt === null) return { kind: 'badge', badge: MISSING };
  if (alt === '') return { kind: 'badge', badge: EMPTY_ALT };
  return { kind: 'text', text: alt };
}

function assessLink(src: string): LinkView {
  if (src === '') return { kind: 'badge', badge: MISSING };
  // Safari не відкриває `data:` у вкладці, а повний URI може мати мегабайти.
  if (src.startsWith('data:'))
    return { kind: 'data', text: `${src.slice(0, src.indexOf(',') + 1)}…` };
  return { kind: 'link', href: src };
}

function assessFile(image: ImageEntry): FileView {
  const { natural, bytes } = image;
  if (natural === null) return { kind: 'badge', badge: NOT_LOADED };
  return {
    kind: 'loaded',
    dimensions: `${natural.width}×${natural.height}`,
    size:
      bytes === null
        ? { kind: 'badge', badge: SIZE_UNKNOWN }
        : { kind: 'text', text: formatBytes(bytes), heavy: isHeavy(image) },
  };
}
