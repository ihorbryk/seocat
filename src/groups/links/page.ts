import { extract } from './extract';

/** Половина Page Group Links: читання `<a href>`, потрапляє в `extract.js` (ADR 0004). */
export const links = { id: 'links' as const, extract };
