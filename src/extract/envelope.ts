import type { GroupSnapshots } from '../groups/page-registry';

/** Що повертає `extract.js` (JSON-серіалізовне). */
export type Envelope =
  | { kind: 'ok'; groups: GroupSnapshots }
  | { kind: 'not-html'; contentType: string }
  | { kind: 'failed'; message: string };

/** Результат вимірювання в попапі: конверт або стан, який знає лише попап. */
export type Outcome = Envelope | { kind: 'unreadable' };
