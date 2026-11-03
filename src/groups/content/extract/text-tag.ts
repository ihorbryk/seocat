/** Сирий знімок текстового тега (title, description): кількість тегів і значення першого. */
export interface TextTag {
  /** Скільки тегів знайдено. 0 = Missing, >1 = Duplicate. */
  count: number;
  /** Обрізане, з колапсованими пробілами значення першого тега; null, якщо тегів (або значення) немає. '' = Empty. */
  value: string | null;
}

/** Семантика `document.title`: обрізати і звести послідовності пробілів до одного. */
export function normalizeText(raw: string): string {
  return raw.replace(/[\t\n\f\r ]+/g, ' ').trim();
}
