import type { BadgeView } from '../ui/types';
import { EMPTY } from './badges';
import type { TextAndAlts } from './text-and-alts';

/** Текст елемента, а без нього — alt Image усередині (з приміткою `img`), або Empty. */
export type TextOrAltView =
  | { kind: 'text'; text: string }
  | { kind: 'image'; text: string }
  | { kind: 'badge'; badge: BadgeView };

/** Правило Anchor text і тексту Heading з `GLOSSARY.md`. */
export function textOrAlt({ text, imageAlts }: TextAndAlts): TextOrAltView {
  if (text) return { kind: 'text', text };
  const alt = imageAlts.filter(Boolean).join(' ');
  if (alt) return { kind: 'image', text: alt };
  return { kind: 'badge', badge: EMPTY };
}
