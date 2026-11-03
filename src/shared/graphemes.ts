/** Кількість графемних кластерів (видимих символів) у рядку. */
export function countGraphemes(text: string): number {
  let count = 0;
  for (const _ of new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)) count++;
  return count;
}
