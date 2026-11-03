import { extract } from './extract';

/** Половина Page Group Content: лише читання DOM, потрапляє в `extract.js` (ADR 0004). */
export const content = { id: 'content' as const, extract };
