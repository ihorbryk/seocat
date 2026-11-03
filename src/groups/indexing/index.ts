import { assess } from './assess';
import { extract } from './extract';
import { View } from './View';

/** Group Indexing: canonical, robots, hreflang. */
export const indexing = { id: 'indexing' as const, label: 'Indexing', extract, assess, View };
