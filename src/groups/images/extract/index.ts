import type { ImageEntry, ImagesSnapshot } from '../types';
import { fileBytes } from './bytes';

/**
 * Читання `<img>` документа верхнього рівня плюс стан їх завантаження (ADR 0005).
 * Асинхронне, бо вага файлу може братися з HTTP-кешу. Однакові адреси читаються один раз.
 */
export async function extract(document: Document): Promise<ImagesSnapshot> {
  const bytesBySrc = new Map<string, Promise<number | null>>();
  const bytesOf = (src: string) => {
    if (!bytesBySrc.has(src)) bytesBySrc.set(src, fileBytes(src));
    return bytesBySrc.get(src)!;
  };
  const images = [...document.querySelectorAll('img')].map((img) => extractImage(img, bytesOf));
  return { images: await Promise.all(images) };
}

async function extractImage(
  img: HTMLImageElement,
  bytesOf: (src: string) => Promise<number | null>,
): Promise<ImageEntry> {
  const src = img.currentSrc || (img.getAttribute('src')?.trim() ? img.src : '');
  const loaded = img.complete && img.naturalWidth > 0;
  return {
    src,
    alt: img.getAttribute('alt'),
    natural: loaded ? { width: img.naturalWidth, height: img.naturalHeight } : null,
    bytes: loaded ? await bytesOf(src) : null,
  };
}
