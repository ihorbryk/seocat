import { textOrAlt, type TextOrAltView } from '../../../shared/text-or-alt';
import type { ContentSnapshot } from '../types';

export interface HeadingView {
  id: string;
  /** 1..6: і мітка `H<level>`, і крок відступу (абсолютний, не відносно попереднього). */
  level: number;
  /** Текст Heading, alt Image усередині або Empty. */
  text: TextOrAltView;
}

/** Outline: кожен Heading у порядку документа. */
export function assessOutline(snapshot: ContentSnapshot): HeadingView[] {
  return snapshot.headings.map((heading, i) => ({
    id: `heading-${i}`,
    level: heading.level,
    text: textOrAlt(heading),
  }));
}
