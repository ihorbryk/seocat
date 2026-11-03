/** Універсальні типи рядка таблиці. Group-незалежні: їх малюють компоненти з src/ui. */
export type Tone = 'good' | 'warn';

export interface BadgeView {
  text: string;
  tone: Tone;
}

/** Значення в правій колонці: або текст (моноширинний), або бейдж замість тексту (напр. Empty-запис списку). */
export type ValueView = { kind: 'text'; text: string } | { kind: 'badge'; badge: BadgeView };

export interface RowView {
  /** Стабільний ідентифікатор рядка (ключ і для тестів). */
  id: string;
  /** Назва Metric у лівій колонці. */
  label: string;
  /** Бейджі під назвою Metric. */
  badges: BadgeView[];
  /** Записи в правій колонці; кожен окремим рядком. */
  values: ValueView[];
}

export interface SectionView {
  id: string;
  /** Рядок-розділювач у верхньому регістрі (Meta, Indexing). */
  title: string;
  rows: RowView[];
}
