import { countGraphemes } from '../../../shared/graphemes';
import { rateLength, type LengthRange } from '../../../shared/length-rating';
import type { BadgeView } from '../../../ui/types';
import type { TextTag } from '../extract/text-tag';

const LABELS = { short: 'Short', good: 'Good', long: 'Long' } as const;

/**
 * Бейджі стану текстового тега: Missing / Empty / Duplicate ×N і `57 chars · Good`.
 * Missing і Empty ніколи не мають довжини. Спільне для Title і Description.
 */
export function textTagBadges(tag: TextTag, range: LengthRange): BadgeView[] {
  const badges: BadgeView[] = [];
  if (tag.count > 1) badges.push({ text: `Duplicate ×${tag.count}`, tone: 'warn' });
  if (tag.value === null) {
    badges.push({ text: 'Missing', tone: 'warn' });
  } else if (tag.value === '') {
    badges.push({ text: 'Empty', tone: 'warn' });
  } else {
    const length = countGraphemes(tag.value);
    const rating = rateLength(length, range);
    badges.push({
      text: `${length} chars · ${LABELS[rating]}`,
      tone: rating === 'good' ? 'good' : 'warn',
    });
  }
  return badges;
}
