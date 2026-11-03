import type { Envelope, Outcome } from '../extract/envelope';

/** Запис кадру з `scripting.executeScript` (потрібні нам поля). */
export interface FrameResult {
  frameId?: number;
  result?: unknown;
  error?: unknown;
}

/** Те, що `measure` потребує від браузера. Адаптери: `browserPort` у попапі, фейки в тестах. */
export interface TabPort {
  /** Активна вкладка поточного вікна; може кинути виняток або не дати вкладки. */
  activeTab(): Promise<{ id?: number; url?: string } | undefined>;
  /** Інжектує `extract.js` у вкладку; може кинути виняток. */
  executeScript(tabId: number): Promise<readonly FrameResult[]>;
}

export interface Measurement {
  /** URL вкладки, якщо браузер його дав. */
  url?: string;
  outcome: Outcome;
}

/**
 * Вимірює активну вкладку. Будь-який збій браузера (виняток `activeTab` чи `executeScript`,
 * немає вкладки чи її id, `error` у записі кадру, відсутній або чужий результат) дає `unreadable`;
 * текст помилки Safari не парситься (ADR 0002). Решту `Outcome` визначає конверт `extract.js`.
 */
export async function measure(port: TabPort): Promise<Measurement> {
  let tab: { id?: number; url?: string } | undefined;
  try {
    tab = await port.activeTab();
  } catch {
    return { outcome: { kind: 'unreadable' } };
  }
  if (tab?.id === undefined) return { url: tab?.url, outcome: { kind: 'unreadable' } };
  try {
    return { url: tab.url, outcome: classify(await port.executeScript(tab.id)) };
  } catch {
    return { url: tab.url, outcome: { kind: 'unreadable' } };
  }
}

const ENVELOPE_KINDS = ['ok', 'not-html', 'failed'];

function isEnvelope(value: unknown): value is Envelope {
  return (
    typeof value === 'object' &&
    value !== null &&
    ENVELOPE_KINDS.includes((value as { kind?: unknown }).kind as string)
  );
}

function classify(results: readonly FrameResult[]): Outcome {
  const frame = results[0];
  if (!frame || frame.error || !isEnvelope(frame.result)) return { kind: 'unreadable' };
  return frame.result;
}
