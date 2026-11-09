import { Badge } from './Badge';
import { CopyButton } from './CopyButton';
import { splitLastGrapheme } from '../shared/graphemes';
import type { RowView, ValueView } from './types';

/** Рядок таблиці: ліворуч назва Metric, під нею лічильник і бейджі, праворуч значення(я) моноширинним шрифтом. */
export function Row({ row }: { row: RowView }) {
  return (
    <tr class="border-b border-line align-top">
      {/* 148px = 128px вмісту + відступи, як `th` у прототипі D (там content-box). */}
      <th scope="row" class="w-37 px-2.5 py-1.5 text-left font-normal">
        <span class="block font-semibold text-ink">{row.label}</span>
        {row.count !== undefined && (
          <span class="mt-0.5 block text-muted tabular-nums">{row.count}</span>
        )}
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
            <Value value={value} />
          </div>
        ))}
      </td>
    </tr>
  );
}

/** Запис правої колонки. Текст із `copy` закінчується кнопкою копіювання: остання графема і кнопка не розриваються, тож кнопка не переноситься сама. */
function Value({ value }: { value: ValueView }) {
  if (value.kind === 'badge') {
    return (
      <>
        {value.prefix}
        <Badge badge={value.badge} />
      </>
    );
  }
  if (value.copy === undefined) return <>{value.text}</>;
  const [head, last] = splitLastGrapheme(value.text);
  return (
    <>
      {head}
      <span class="whitespace-nowrap">
        {last}
        <CopyButton text={value.copy} />
      </span>
    </>
  );
}
