/** Кількість графемних кластерів (видимих символів) у рядку. */
export function countGraphemes(text: string): number {
  let count = 0;
  for (const _ of new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)) count++;
  return count;
}

/** Ділить рядок на все до останнього графемного кластера і сам цей кластер. */
export function splitLastGrapheme(text: string): [string, string] {
  let last = '';
  for (const { segment } of new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(
    text,
  ))
    last = segment;
  return [text.slice(0, text.length - last.length), last];
}
