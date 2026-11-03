import { assess } from './assess';
import { extract } from './extract';
import { View } from './View';

/** Group `seo-basics`: власні extract / assess / View (id лише в коді, в UI не показується). */
export const seoBasics = { id: 'seo-basics' as const, extract, assess, View };
