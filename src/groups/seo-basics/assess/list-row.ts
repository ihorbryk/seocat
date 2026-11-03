import type { BadgeView, RowView, ValueView } from '../../../ui/types';

const EMPTY: BadgeView = { text: 'Empty', tone: 'warn' };

/** Запис списку: `prefix + value`, а для порожнього value (Empty) бейдж Empty з тим самим префіксом. */
export function listValue(prefix: string, value: string): ValueView {
  return value === ''
    ? { kind: 'badge', badge: EMPTY, ...(prefix ? { prefix } : {}) }
    : { kind: 'text', text: prefix + value };
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
    return { id, label, badges: [{ text: 'Missing', tone: 'warn' }], values };
  }
  if (duplicates && values.length > 1) {
    return { id, label, badges: [{ text: `Duplicate ×${values.length}`, tone: 'warn' }], values };
  }
  return { id, label, count: values.length, badges: [], values };
}
