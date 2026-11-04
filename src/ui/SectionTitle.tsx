/** Вигляд рядка-розділювача секції Group: у таблиці (`Table`) і поза нею (Outline Content). */
export const SECTION_TITLE_CLASS =
  'bg-surface-2 px-2.5 py-1 text-left text-[10px] font-semibold tracking-wider text-muted uppercase';

/** Розділювач секції поза таблицею. */
export function SectionTitle({ title }: { title: string }) {
  return <h2 class={`m-0 ${SECTION_TITLE_CLASS}`}>{title}</h2>;
}
