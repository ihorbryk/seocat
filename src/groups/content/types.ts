import type { SectionView } from '../../ui/types';
import type { TextTag } from './extract/text-tag';
import type { HeaderView } from './assess/header';

/**
 * Сирий JSON-серіалізовний знімок Group Content. Виконується на Page (extract),
 * читається в попапі (assess). Кожен наступний Metric додає тут одне поле.
 */
export interface ContentSnapshot {
  title: TextTag;
  description: TextTag;
  words: number;
  links: number;
  /** Лічильники H1..H6 (індекс 0 = H1). */
  headings: number[];
}

/** Готове до показу: хедер (плитки й діаграма) + секції таблиці. */
export interface ContentView {
  header: HeaderView;
  sections: SectionView[];
}
