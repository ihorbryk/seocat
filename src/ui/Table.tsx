import { Row } from './Row';
import { SECTION_TITLE_CLASS } from './SectionTitle';
import type { SectionView } from './types';

/**
 * Таблиця Group. Рядок-розділювач секції з'являється, коли секцій більше однієї,
 * або коли `divided` (у Group є ще секції поза таблицею).
 */
export function Table({
  sections,
  divided = sections.length > 1,
}: {
  sections: SectionView[];
  divided?: boolean;
}) {
  return (
    <table class="w-full border-collapse">
      {sections.map((section) => (
        <tbody key={section.id}>
          {divided && (
            <tr>
              <th colSpan={2} scope="colgroup" class={SECTION_TITLE_CLASS}>
                {section.title}
              </th>
            </tr>
          )}
          {section.rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </tbody>
      ))}
    </table>
  );
}
