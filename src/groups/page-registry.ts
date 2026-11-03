import { content } from './content/page';
import { indexing } from './indexing/page';

/**
 * Половини Page усіх Groups (ADR 0004). Імпортує лише `page.ts`, тож у `extract.js`
 * не потрапляють `assess`, `View` і preact. Порядок тут не важливий: вкладки впорядковує `popup-registry`.
 */
export const pageGroups = [content, indexing] as const;

type PageGroup = (typeof pageGroups)[number];

export type GroupId = PageGroup['id'];

/** Знімки всіх Groups за id; тип кожного виводиться з її `extract`. */
export type GroupSnapshots = { [G in PageGroup as G['id']]: ReturnType<G['extract']> };
