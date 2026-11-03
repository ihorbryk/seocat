import { extract } from './extract';

/** Половина Page Group Images: читання `<img>` і стану їх завантаження, потрапляє в `extract.js` (ADR 0004, 0005). */
export const images = { id: 'images' as const, extract };
