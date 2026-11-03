import { countGraphemes } from '../../../shared/graphemes';
import { rateLength, type LengthRange } from '../../../shared/length-rating';
import type { BadgeView } from '../../../ui/types';
import type { TextTag } from '../extract/text-tag';
import { duplicate, EMPTY, MISSING } from '../../../shared/badges';

const LABELS = { short: 'Short', good: 'Good', long: 'Long' } as const;

/**
 * Бейджі стану текстового тега: Missing / Empty / `57 chars · Good`, а Duplicate ×N останнім.
 * Missing і Empty ніколи не мають довжини. Спільне для Title і Description.
 */
export function textTagBadges(tag: TextTag, range: LengthRange): BadgeView[] {
  const badges: BadgeView[] = [];
  if (tag.value === null) {
    badges.push(MISSING);
  } else if (tag.value === '') {
    badges.push(EMPTY);
  } else {
    const length = countGraphemes(tag.value);
    const rating = rateLength(length, range);
    badges.push({
      text: `${length} chars · ${LABELS[rating]}`,
      tone: rating === 'good' ? 'good' : 'warn',
    });
  }
  if (tag.count > 1) badges.push(duplicate(tag.count));
  return badges;
}
