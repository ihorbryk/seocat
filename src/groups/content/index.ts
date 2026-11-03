import { assess } from './assess';
import { extract } from './extract';
import { View } from './View';

/** Group Content: meta title і description, хедер з плитками й діаграмою H1–H6. */
export const content = { id: 'content' as const, label: 'Content', extract, assess, View };
