import { duplicate, EMPTY, MISSING } from '../../../shared/badges';
import type { RowView, ValueView } from '../../../ui/types';

/** Запис списку: `prefix + value` з копіюванням лише value, а для порожнього value (Empty) бейдж Empty з тим самим префіксом. */
export function listValue(prefix: string, value: string): ValueView {
  return value === ''
    ? { kind: 'badge', badge: EMPTY, ...(prefix ? { prefix } : {}) }
    : { kind: 'text', text: prefix + value, copy: value };
}

/**
 * Рядок-список: Missing, якщо записів немає; інакше кількість у лівій колонці
 * (або Duplicate ×N, якщо `duplicates`) і кожен запис окремим значенням.
 */
export function listRow(
  id: string,
  label: string,
  values: ValueView[],
  { duplicates = false }: { duplicates?: boolean } = {},
): RowView {
  if (values.length === 0) {
    return { id, label, badges: [MISSING], values };
  }
  if (duplicates && values.length > 1) {
    return { id, label, badges: [duplicate(values.length)], values };
  }
  return { id, label, count: values.length, badges: [], values };
}
