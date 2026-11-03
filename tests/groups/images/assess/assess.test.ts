import { describe, expect, it } from 'vitest';
import { assess } from '../../../../src/groups/images/assess';
import type { ImageEntry } from '../../../../src/groups/images/types';
import { imageEntry, imagesSnapshot } from '../../../snapshot';

const one = (over: Partial<ImageEntry>) =>
  assess(imagesSnapshot({ images: [imageEntry(over)] })).images[0]!;

describe('assess Images: alt', () => {
  it('текст як є', () => {
    expect(one({ alt: 'Hero banner' }).alt).toEqual({ kind: 'text', text: 'Hero banner' });
  });
  it('без атрибута: Missing з попередженням', () => {
    expect(one({ alt: null }).alt).toEqual({
      kind: 'badge',
      badge: { text: 'Missing', tone: 'warn' },
    });
  });
  it('alt="": Empty без попередження (декоративне зображення)', () => {
    expect(one({ alt: '' }).alt).toEqual({
      kind: 'badge',
      badge: { text: 'Empty', tone: 'neutral' },
    });
  });
});

describe('assess Images: посилання і прев’ю', () => {
  it('звичайний URL: посилання і прев’ю з тієї ж адреси', () => {
    const image = one({ src: 'https://example.com/a.png' });
    expect(image.link).toEqual({ kind: 'link', href: 'https://example.com/a.png' });
    expect(image.preview).toBe('https://example.com/a.png');
  });
  it('data: URI: скорочений текст без посилання, прев’ю з повного URI', () => {
    const src = 'data:image/png;base64,aGVsbG8=';
    const image = one({ src });
    expect(image.link).toEqual({ kind: 'data', text: 'data:image/png;base64,…' });
    expect(image.preview).toBe(src);
  });
  it('адреси немає: Missing і без прев’ю', () => {
    const image = one({ src: '' });
    expect(image.link).toEqual({ kind: 'badge', badge: { text: 'Missing', tone: 'warn' } });
    expect(image.preview).toBeNull();
  });
});

describe('assess Images: розміри і вага', () => {
  it('не завантажено: Not loaded замість розмірів і ваги', () => {
    expect(one({ natural: null, bytes: null }).file).toEqual({
      kind: 'badge',
      badge: { text: 'Not loaded', tone: 'neutral' },
    });
  });
  it('вага невідома: розміри і Size unknown', () => {
    expect(one({ natural: { width: 1600, height: 900 }, bytes: null }).file).toEqual({
      kind: 'loaded',
      dimensions: '1600×900',
      size: { kind: 'badge', badge: { text: 'Size unknown', tone: 'neutral' } },
    });
  });
  it.each([
    [0, '0 B', false],
    [1023, '1023 B', false],
    [1024, '1 KB', false],
    [250_880, '245 KB', false],
    [1_048_575, '1.0 MB', false],
    [1_048_576, '1.0 MB', false],
    [1_048_577, '1.0 MB', true],
    [1_468_006, '1.4 MB', true],
  ] as const)('%i байтів -> %s, червоне: %s', (bytes, text, heavy) => {
    const file = one({ bytes }).file;
    expect(file).toEqual({
      kind: 'loaded',
      dimensions: '100×50',
      size: { kind: 'text', text, heavy },
    });
  });
});

describe('assess Images: хедер', () => {
  it('Total, Missing alt, Empty alt, > 1 MB; невідома вага не рахується у > 1 MB', () => {
    const view = assess(
      imagesSnapshot({
        images: [
          imageEntry({ alt: null, bytes: 2_000_000 }),
          imageEntry({ alt: null }),
          imageEntry({ alt: '' }),
          imageEntry({ bytes: null }),
          imageEntry({ natural: null, bytes: null }),
        ],
      }),
    );
    expect(view.header.tiles).toEqual([
      { id: 'total', value: '5', label: 'images', tone: 'neutral' },
      { id: 'missing-alt', value: '2', label: 'missing alt', tone: 'warn' },
      { id: 'empty-alt', value: '1', label: 'empty alt', tone: 'neutral' },
      { id: 'heavy', value: '1', label: '> 1 MB', tone: 'bad' },
    ]);
  });
  it('нулі без кольору', () => {
    expect(assess(imagesSnapshot()).header.tiles.map((t) => [t.value, t.tone])).toEqual([
      ['0', 'neutral'],
      ['0', 'neutral'],
      ['0', 'neutral'],
      ['0', 'neutral'],
    ]);
  });
  it('Images у порядку знімка з унікальними id', () => {
    const view = assess(imagesSnapshot({ images: [imageEntry(), imageEntry()] }));
    expect(view.images.map((i) => i.id)).toEqual(['image-0', 'image-1']);
  });
});
