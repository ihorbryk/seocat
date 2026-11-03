import type { ImagesSnapshot, ImagesView } from '../types';
import { assessHeader } from './header';
import { assessImage } from './image';

/** Чиста функція «знімок → view»: тут народжуються Missing / Empty / Not loaded / Size unknown. */
export function assess(snapshot: ImagesSnapshot): ImagesView {
  return { header: assessHeader(snapshot), images: snapshot.images.map(assessImage) };
}
