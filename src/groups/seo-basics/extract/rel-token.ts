/** Чи містить атрибут `rel` елемента токен (без урахування регістру). */
export function hasRelToken(el: Element, token: string): boolean {
  return (el.getAttribute('rel') ?? '').toLowerCase().split(/\s+/).includes(token);
}
