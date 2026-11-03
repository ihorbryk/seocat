import type { PageSnapshot } from '../types';

/** Хедер: URL (плитки і діаграма заголовків додаються тікетом #4). */
export interface HeaderView {
  url: string;
}

export function assessHeader(snapshot: PageSnapshot): HeaderView {
  return { url: snapshot.url };
}
