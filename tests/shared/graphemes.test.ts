import { describe, expect, it } from 'vitest';
import { splitLastGrapheme } from '../../src/shared/graphemes';

describe('splitLastGrapheme', () => {
  it('відділяє останній символ', () => {
    expect(splitLastGrapheme('Example Blog')).toEqual(['Example Blo', 'g']);
  });

  it('емодзі з модифікатором — одна графема', () => {
    expect(splitLastGrapheme('Like 👍🏽')).toEqual(['Like ', '👍🏽']);
  });

  it('порожній рядок', () => {
    expect(splitLastGrapheme('')).toEqual(['', '']);
  });
});
