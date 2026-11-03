import { extract } from './extract';

/** Половина Page Group Indexing: лише читання DOM, потрапляє в `extract.js` (ADR 0004). */
export const indexing = { id: 'indexing' as const, extract };
