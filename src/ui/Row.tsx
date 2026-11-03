import { Badge } from './Badge';
import type { RowView } from './types';

/** Рядок таблиці: ліворуч назва Metric і бейджі під нею, праворуч значення(я) моноширинним шрифтом. */
export function Row({ row }: { row: RowView }) {
  return (
    <tr class="border-b border-line align-top">
      <th scope="row" class="w-32 px-2.5 py-1.5 text-left font-normal">
        <span class="block font-semibold text-ink">{row.label}</span>
        {row.badges.length > 0 && (
          <span class="mt-0.5 flex flex-wrap gap-1">
            {row.badges.map((badge) => (
              <Badge key={badge.text} badge={badge} />
            ))}
          </span>
        )}
      </th>
      <td class="px-2.5 py-1.5 font-mono text-xs wrap-anywhere">
        {row.values.map((value, i) => (
          <div
            key={i}
            class="not-first:mt-[3px] not-first:border-t not-first:border-dotted not-first:border-line not-first:pt-[3px]"
          >
            {value.kind === 'text' ? value.text : <Badge badge={value.badge} />}
          </div>
        ))}
      </td>
    </tr>
  );
}
