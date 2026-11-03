import type { ContentSnapshot } from '../groups/content/types';
import type { IndexingSnapshot } from '../groups/indexing/types';

/** Знімки всіх Groups з реєстру за id. Нова Group додає сюди один ключ. */
export interface GroupSnapshots {
  content: ContentSnapshot;
  indexing: IndexingSnapshot;
}

/** Що повертає `extract.js` (JSON-серіалізовне). */
export type Envelope =
  | { kind: 'ok'; groups: GroupSnapshots }
  | { kind: 'not-html'; contentType: string }
  | { kind: 'failed'; message: string };

/** Результат `classify` у попапі: конверт або стан, який знає лише попап. */
export type Outcome = Envelope | { kind: 'unreadable' };
