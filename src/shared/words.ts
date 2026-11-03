/** Кількість слів (сегменти Intl.Segmenter з isWordLike) у рядку. */
export function countWords(text: string): number {
  let count = 0;
  for (const s of new Intl.Segmenter(undefined, { granularity: 'word' }).segment(text)) {
    if (s.isWordLike) count++;
  }
  return count;
}
