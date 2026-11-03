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
  description: TextTag;
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

/** Готове до показу: хедер + секції таблиці. */
export interface GroupView {
  header: HeaderView;
  sections: SectionView[];
}
