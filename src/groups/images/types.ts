import type { HeaderView } from './assess/header';
import type { ImageView } from './assess/image';

/**
 * Сирий JSON-серіалізовний знімок Group Images. Виконується на Page (extract),
 * читається в попапі (assess). Розміри й вага беруться із завантаженого ресурсу (ADR 0005).
 */
export interface ImagesSnapshot {
  /** Кожен `<img>` у порядку документа. */
  images: ImageEntry[];
}

export interface ImageEntry {
  /** `currentSrc`, інакше абсолютний `src`; '' = адреси немає. */
  src: string;
  /** null = атрибута немає (Missing); '' = Empty. */
  alt: string | null;
  /** Natural-розміри файлу; null = файл не завантажено. */
  natural: { width: number; height: number } | null;
  /** Вага файлу в байтах; null = браузер її не віддає. */
  bytes: number | null;
}

/** Готове до показу: хедер із плитками і список Images. */
export interface ImagesView {
  header: HeaderView;
  images: ImageView[];
}
