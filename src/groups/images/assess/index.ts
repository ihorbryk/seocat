import type { ImagesSnapshot, ImagesView } from '../types';
import { assessHeader } from './header';
import { assessImage } from './image';

/** Чиста функція «знімок → view»: тут народжуються Missing / Empty / Not loaded / Size unknown / Heavy. */
export function assess(snapshot: ImagesSnapshot): ImagesView {
  const images = snapshot.images.map(assessImage);
  return { header: assessHeader(images), images };
}
