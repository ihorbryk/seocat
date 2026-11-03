/** Універсальні типи рядка таблиці. Group-незалежні: їх малюють компоненти з src/ui. */
export type Tone = 'good' | 'warn';

export interface BadgeView {
  text: string;
  tone: Tone;
}

/** Значення в правій колонці: або текст (моноширинний), або бейдж замість тексту (напр. Empty-запис списку). */
export type ValueView =
  | { kind: 'text'; text: string }
  | {
      kind: 'badge';
      badge: BadgeView;
      /** Текст перед бейджем (напр. `de → `). */ prefix?: string;
    };

export interface RowView {
  /** Стабільний ідентифікатор рядка (ключ і для тестів). */
  id: string;
  /** Назва Metric у лівій колонці. */
  label: string;
  /** Кількість тегів поруч із назвою (списки: Canonical, Robots, hreflang); нема, якщо не потрібно. */
  count?: number;
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
