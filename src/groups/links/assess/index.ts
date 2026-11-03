import type { LinksSnapshot, LinksView } from '../types';
import { assessHeader } from './header';
import { assessLink, siteHost } from './link';

/** Чиста функція «знімок → view»: тут народжуються Internal / External / Nofollow і Empty. */
export function assess({ page, links }: LinksSnapshot): LinksView {
  const pageHost = siteHost(page);
  const views = links.map((link, i) => assessLink(link, i, pageHost));
  return { header: assessHeader(views), links: views };
}
