/** Абсолютний URL з `href` елемента; відсутній або порожній (після обрізання) `href` дає ''. */
export function absoluteHref(el: Element): string {
  const raw = el.getAttribute('href')?.trim();
  if (!raw) return '';
  return (el as HTMLLinkElement).href;
}
