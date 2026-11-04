import type { TextAndAlts } from '../../shared/text-and-alts';
import type { HeaderView } from './assess/header';
import type { LinkView } from './assess/link';

/**
 * Сирий JSON-серіалізовний знімок Group Links. Виконується на Page (extract),
 * читається в попапі (assess), де народжуються Internal / External / Nofollow і Empty.
 */
export interface LinksSnapshot {
  /** Адреса Page (`document.URL`): з її host порівнюється host кожного Link. */
  page: string;
  /** Кожен `<a href>` у порядку документа. */
  links: LinkEntry[];
}

export interface LinkEntry extends TextAndAlts {
  /** Абсолютна адреса; '' = порожній `href`. */
  href: string;
  /** Токени `rel` у нижньому регістрі. */
  rel: string[];
}

/** Готове до показу: хедер із плитками-фільтрами і список Links. */
export interface LinksView {
  header: HeaderView;
  links: LinkView[];
}
