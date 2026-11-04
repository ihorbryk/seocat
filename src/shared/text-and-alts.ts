/** Сирий текст елемента і alt кожного `<img alt>` усередині: з них виводяться Anchor text і текст Heading. */
export interface TextAndAlts {
  /** `textContent` зі стиснутими пробілами. */
  text: string;
  /** alt кожного `<img alt>` усередині в порядку документа, зі стиснутими пробілами. */
  imageAlts: string[];
}

const squash = (text: string) => text.replace(/\s+/g, ' ').trim();

export function readTextAndAlts(el: Element): TextAndAlts {
  return {
    text: squash(el.textContent ?? ''),
    imageAlts: [...el.querySelectorAll('img[alt]')].map((img) => squash(img.getAttribute('alt')!)),
  };
}
