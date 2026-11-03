import { groups as registry } from '../groups/registry';
import type { Envelope, GroupSnapshots } from '../shared/envelope';

/** Мінімум, потрібний `run` від Group (дозволяє підставляти фейки в тестах). */
export interface ExtractableGroup {
  id: string;
  extract(document: Document): unknown;
}

const HTML_TYPES = ['text/html', 'application/xhtml+xml'];

/**
 * Виконується на Page. Не-HTML -> `not-html` без запуску Groups (ADR 0002);
 * виняток будь-якої Group -> `failed`.
 */
export function run(document: Document, groups: readonly ExtractableGroup[] = registry): Envelope {
  if (!HTML_TYPES.includes(document.contentType)) {
    return { kind: 'not-html', contentType: document.contentType };
  }
  try {
    const snapshots: Record<string, unknown> = {};
    for (const group of groups) snapshots[group.id] = group.extract(document);
    return { kind: 'ok', groups: snapshots as unknown as GroupSnapshots };
  } catch (error) {
    return { kind: 'failed', message: error instanceof Error ? error.message : String(error) };
  }
}
