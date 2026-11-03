import type { JSX } from 'preact';
import { content } from './content/popup';
import { images } from './images/popup';
import { indexing } from './indexing/popup';
import { links } from './links/popup';
import type { GroupId, GroupSnapshots } from './page-registry';

/** Половина попапа однієї Group: назва вкладки і панель, що з знімка малює view. */
interface PopupGroup<Id extends GroupId> {
  id: Id;
  label: string;
  Panel: (props: { snapshot: GroupSnapshots[Id] }) => JSX.Element;
}

type AnyPopupGroup = { [Id in GroupId]: PopupGroup<Id> }[GroupId];

/** Тип стає `never`, якщо якась Group з `page-registry` не має половини попапа. */
type CoversAll<T extends readonly AnyPopupGroup[]> =
  Exclude<GroupId, T[number]['id']> extends never ? T : never;

const list = [content, indexing, images, links] as const satisfies readonly AnyPopupGroup[];

/** Половини попапа (ADR 0004). Порядок = порядок вкладок; перша вкладка за замовчуванням. */
export const popupGroups: CoversAll<typeof list> = list;

/** id Group з довільного рядка; невідомий або відсутній дає першу вкладку (Content). */
export function toGroupId(value: string | null | undefined): GroupId {
  return popupGroups.find((g) => g.id === value)?.id ?? popupGroups[0].id;
}

/** Панель Group за id. Зв'язок «id ↔ тип знімка» TypeScript не виводить для об'єднання, тому каст живе лише тут. */
export function GroupPanel({ id, snapshots }: { id: GroupId; snapshots: GroupSnapshots }) {
  const group = popupGroups.find((g) => g.id === id)!;
  const Panel = group.Panel as (props: { snapshot: GroupSnapshots[GroupId] }) => JSX.Element;
  return <Panel snapshot={snapshots[id]} />;
}
