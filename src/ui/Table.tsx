import { Row } from './Row';
import type { SectionView } from './types';

export function Table({ sections }: { sections: SectionView[] }) {
  return (
    <table class="w-full border-collapse">
      {sections.map((section) => (
        <tbody key={section.id}>
          <tr>
            <th
              colSpan={2}
              scope="colgroup"
              class="bg-surface-2 px-2.5 py-1 text-left text-[10px] font-semibold tracking-wider text-muted uppercase"
            >
              {section.title}
            </th>
          </tr>
          {section.rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </tbody>
      ))}
    </table>
  );
}
