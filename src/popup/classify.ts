import type { Envelope, Outcome } from '../extract/envelope';

/** Запис кадру з `scripting.executeScript` (потрібні нам поля). */
export interface FrameResult {
  frameId?: number;
  result?: unknown;
  error?: unknown;
}

/** Спроба `executeScript`: або масив результатів, або кинутий виняток. */
export type Attempt = { results: readonly FrameResult[] } | { thrown: unknown };

const ENVELOPE_KINDS = ['ok', 'not-html', 'failed'];

function isEnvelope(value: unknown): value is Envelope {
  return (
    typeof value === 'object' &&
    value !== null &&
    ENVELOPE_KINDS.includes((value as { kind?: unknown }).kind as string)
  );
}

/**
 * Виняток, `error` у записі кадру або відсутній результат -> `unreadable`.
 * Текст помилки Safari не парситься (ADR 0002).
 */
export function classify(attempt: Attempt): Outcome {
  if ('thrown' in attempt) return { kind: 'unreadable' };
  const frame = attempt.results[0];
  if (!frame || frame.error || !isEnvelope(frame.result)) return { kind: 'unreadable' };
  return frame.result;
}
