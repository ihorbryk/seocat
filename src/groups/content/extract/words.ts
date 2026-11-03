import { countWords } from '../../../shared/words';

const EXCLUDED = new Set(['script', 'style', 'noscript', 'template', 'svg', 'iframe', 'object']);

/** Текстові вузли елемента <body> без виключених піддерев (ADR 0003). */
function collectText(node: Node, out: string[]): void {
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === 3) out.push(child.nodeValue ?? '');
    else if (child.nodeType === 1 && !EXCLUDED.has((child as Element).localName)) {
      collectText(child, out);
    }
  }
}

export function extractWords(document: Document): number {
  if (!document.body) return 0;
  const parts: string[] = [];
  collectText(document.body, parts);
  return countWords(parts.join(' '));
}
