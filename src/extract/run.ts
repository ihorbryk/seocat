import { pageGroups, type GroupSnapshots } from '../groups/page-registry';
import type { Envelope } from './envelope';

/** Мінімум, потрібний `run` від половини Page Group (дозволяє підставляти фейки в тестах). */
export interface ExtractableGroup {
  id: string;
  extract(document: Document): unknown;
}

const HTML_TYPES = ['text/html', 'application/xhtml+xml'];

/**
 * Виконується на Page. Не-HTML -> `not-html` без запуску Groups (ADR 0002);
 * виняток будь-якої Group (зокрема відхилений Promise) -> `failed`.
 * Асинхронний, бо `extract` Group може повернути Promise (Images читає HTTP-кеш, ADR 0005).
 */
export async function run(
  document: Document,
  groups: readonly ExtractableGroup[] = pageGroups,
): Promise<Envelope> {
  if (!HTML_TYPES.includes(document.contentType)) {
    return { kind: 'not-html', contentType: document.contentType };
  }
  try {
    const snapshots: Record<string, unknown> = {};
    for (const group of groups) snapshots[group.id] = await group.extract(document);
    return { kind: 'ok', groups: snapshots as GroupSnapshots };
  } catch (error) {
    return { kind: 'failed', message: error instanceof Error ? error.message : String(error) };
  }
}
