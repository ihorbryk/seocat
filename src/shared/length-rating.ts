export type LengthRating = 'short' | 'good' | 'long';

/** Включні межі діапазону Good. */
export interface LengthRange {
  min: number;
  max: number;
}

export function rateLength(length: number, range: LengthRange): LengthRating {
  if (length < range.min) return 'short';
  if (length > range.max) return 'long';
  return 'good';
}
