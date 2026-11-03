/** Усі <a> з атрибутом href, будь-яка схема, дублікати рахуються. */
export function extractLinks(document: Document): number {
  return document.querySelectorAll('a[href]').length;
}

/** Шість лічильників H1–H6, порожні й приховані враховуються. */
export function extractHeadings(document: Document): number[] {
  return [1, 2, 3, 4, 5, 6].map((n) => document.querySelectorAll(`h${n}`).length);
}
