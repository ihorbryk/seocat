import { content } from './content/page';
import { images } from './images/page';
import { indexing } from './indexing/page';

/**
 * Половини Page усіх Groups (ADR 0004). Імпортує лише `page.ts`, тож у `extract.js`
 * не потрапляють `assess`, `View` і preact. Порядок тут не важливий: вкладки впорядковує `popup-registry`.
 */
export const pageGroups = [content, indexing, images] as const;

type PageGroup = (typeof pageGroups)[number];

export type GroupId = PageGroup['id'];

/** Знімки всіх Groups за id; тип кожного виводиться з її `extract` (синхронного чи ні). */
export type GroupSnapshots = { [G in PageGroup as G['id']]: Awaited<ReturnType<G['extract']>> };
