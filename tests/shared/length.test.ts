import { describe, expect, it } from 'vitest';
import { countGraphemes } from '../../src/shared/graphemes';
import { rateLength } from '../../src/shared/length-rating';

describe('countGraphemes', () => {
  it('рахує емодзі зі скін-тоном як один символ', () => {
    expect(countGraphemes('👍🏽')).toBe(1);
  });
  it('рахує кириличні літери по одній', () => {
    expect(countGraphemes('привіт')).toBe(6);
  });
  it('не залежить від нормалізації', () => {
    expect(countGraphemes('é')).toBe(1);
    expect(countGraphemes('é')).toBe(1);
  });
});

describe('rateLength', () => {
  const title = { min: 30, max: 60 };
  it.each([
    [29, 'short'],
    [30, 'good'],
    [60, 'good'],
    [61, 'long'],
  ] as const)('довжина %i -> %s', (length, rating) => {
    expect(rateLength(length, title)).toBe(rating);
  });
});
