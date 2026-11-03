import type { RobotsEntry } from '../types';

const NAMES = ['robots', 'googlebot', 'googlebot-news', 'bingbot'];

/** Кожен `<meta name=robots|googlebot|googlebot-news|bingbot>` у порядку документа. content '' = Empty. */
export function extractRobots(document: Document): RobotsEntry[] {
  return [...document.querySelectorAll('meta[name]')].flatMap((el) => {
    const name = el.getAttribute('name')?.trim().toLowerCase() ?? '';
    if (!NAMES.includes(name)) return [];
    return [{ name, content: (el.getAttribute('content') ?? '').trim() }];
  });
}
