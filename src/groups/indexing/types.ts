import type { SectionView } from '../../ui/types';

/**
 * Сирий JSON-серіалізовний знімок Group Indexing. Виконується на Page (extract),
 * читається в попапі (assess). Кожен наступний Metric додає тут одне поле.
 */
export interface IndexingSnapshot {
  /** Абсолютні href кожного canonical; '' = Empty. */
  canonical: string[];
  robots: RobotsEntry[];
  hreflang: HreflangEntry[];
}

export interface RobotsEntry {
  /** Нижнім регістром. */
  name: string;
  /** '' = Empty. */
  content: string;
}

export interface HreflangEntry {
  code: string;
  /** Абсолютний URL; '' = Empty. */
  href: string;
}

/** Готове до показу: лише секції таблиці, без хедера. */
export interface IndexingView {
  sections: SectionView[];
}
