import type { TextAndAlts } from '../../shared/text-and-alts';
import type { SectionView } from '../../ui/types';
import type { TextTag } from './extract/text-tag';
import type { HeaderView } from './assess/header';
import type { HeadingView } from './assess/outline';

/**
 * Сирий JSON-серіалізовний знімок Group Content. Виконується на Page (extract),
 * читається в попапі (assess). Кожен наступний Metric додає тут одне поле.
 */
export interface ContentSnapshot {
  title: TextTag;
  description: TextTag;
  words: number;
  /** Кожен Heading у порядку документа. */
  headings: HeadingEntry[];
}

export interface HeadingEntry extends TextAndAlts {
  /** 1..6, цифра тегу. */
  level: number;
}

/** Готове до показу: хедер (плитки й діаграма), секції таблиці й Outline. */
export interface ContentView {
  header: HeaderView;
  sections: SectionView[];
  outline: HeadingView[];
}
