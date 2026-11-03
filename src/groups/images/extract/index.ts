import type { ImageEntry, ImagesSnapshot } from '../types';
import { fileBytes } from './bytes';

/** Чисте читання `<img>` документа верхнього рівня плюс стан їх завантаження (ADR 0005). */
export function extract(document: Document): ImagesSnapshot {
  return { images: [...document.querySelectorAll('img')].map(extractImage) };
}

function extractImage(img: HTMLImageElement): ImageEntry {
  const src = img.currentSrc || (img.getAttribute('src')?.trim() ? img.src : '');
  const loaded = img.complete && img.naturalWidth > 0;
  return {
    src,
    alt: img.getAttribute('alt'),
    natural: loaded ? { width: img.naturalWidth, height: img.naturalHeight } : null,
    bytes: loaded ? fileBytes(src) : null,
  };
}
