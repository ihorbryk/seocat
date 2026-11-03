import type { SectionView } from '../../ui/types';
import type { TextTag } from './extract/text-tag';
import type { HeaderView } from './assess/header';

/**
 * Сирий JSON-серіалізовний знімок Group `seo-basics`. Виконується на Page (extract),
 * читається в попапі (assess). Кожен наступний Metric додає тут одне поле.
 */
export interface PageSnapshot {
  url: string;
  title: TextTag;
  words: number;
  images: number;
  links: number;
  /** Лічильники H1..H6 (індекс 0 = H1). */
  headings: number[];
}

/** Готове до показу: хедер + секції таблиці. */
export interface GroupView {
  header: HeaderView;
  sections: SectionView[];
}
