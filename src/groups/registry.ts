import { content } from './content';
import { indexing } from './indexing';

/** Реєстр Groups. Порядок = порядок вкладок у попапі; перша вкладка за замовчуванням. */
export const groups = [content, indexing] as const;

export type GroupId = (typeof groups)[number]['id'];

/** id Group з довільного рядка; невідомий або відсутній дає першу Group реєстру (Content). */
export function toGroupId(value: string | null | undefined): GroupId {
  return groups.find((g) => g.id === value)?.id ?? groups[0].id;
}
