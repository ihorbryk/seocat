import type { ImageEntry } from '../types';

const KB = 1024;
const MB = 1024 * KB;

/** Межа важкого файлу: вага строго більша за 1 MB (1 048 576 байтів) підсвічується. */
export const HEAVY_BYTES = MB;

/** Важкий лише завантажений Image з відомою вагою: Not loaded і Size unknown не рахуються. */
export function isHeavy({ natural, bytes }: ImageEntry): boolean {
  return natural !== null && bytes !== null && bytes > HEAVY_BYTES;
}

/** `812 B`, `245 KB`, `1.4 MB` (бінарні одиниці). */
export function formatBytes(bytes: number): string {
  if (bytes < KB) return `${bytes} B`;
  // 1 048 575 B округлилось би до «1024 KB»; такі значення показуються вже в MB.
  if (Math.round(bytes / KB) < 1024) return `${Math.round(bytes / KB)} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
}
