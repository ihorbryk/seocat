import type { PageSnapshot } from '../groups/seo-basics/types';

/** Знімки всіх Groups з реєстру за id. Нова Group додає сюди один ключ. */
export interface GroupSnapshots {
  'seo-basics': PageSnapshot;
}

/** Що повертає `extract.js` (JSON-серіалізовне). */
export type Envelope =
  | { kind: 'ok'; groups: GroupSnapshots }
  | { kind: 'not-html'; contentType: string }
  | { kind: 'failed'; message: string };

/** Результат `classify` у попапі: конверт або стан, який знає лише попап. */
export type Outcome = Envelope | { kind: 'unreadable' };
