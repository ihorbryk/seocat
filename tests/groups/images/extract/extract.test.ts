import { afterEach, describe, expect, it, vi } from 'vitest';
import { extract } from '../../../../src/groups/images/extract';
import { loadFixture, parseHtml } from '../../../helpers';

/**
 * jsdom нічого не завантажує, тож те, що в Safari дає завантажений ресурс (ADR 0005),
 * підставляється на межі з API браузера: властивості `<img>` і Resource Timing.
 */
function load(img: Element, { width, height, currentSrc }: LoadedFile) {
  Object.defineProperties(img, {
    complete: { value: true },
    naturalWidth: { value: width },
    naturalHeight: { value: height },
    ...(currentSrc === undefined ? {} : { currentSrc: { value: currentSrc } }),
  });
}
interface LoadedFile {
  width: number;
  height: number;
  currentSrc?: string;
}

/** Resource Timing з відомою вагою (`encodedBodySize`) для кожного URL. */
function timing(sizes: Record<string, number>) {
  vi.stubGlobal('performance', {
    getEntriesByName: (name: string, type?: string) =>
      type === 'resource' && name in sizes ? [{ encodedBodySize: sizes[name] }] : [],
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('images extract: які Images і в якому порядку', () => {
  it('лише <img>, у порядку документа, повтори окремо; svg, CSS-фон, input[type=image], favicon пропущено', () => {
    expect(extract(loadFixture('images-mixed')).images.map((i) => i.src)).toEqual([
      'https://example.com/blog/hero.jpg',
      'https://example.com/img/decor.png',
      'https://cdn.example.net/photo.webp',
      '',
      'https://example.com/blog/hero.jpg',
    ]);
  });

  it('сторінка без <img>: порожній список', () => {
    expect(extract(parseHtml('<p>text</p>')).images).toEqual([]);
  });
});

describe('images extract: alt', () => {
  it('текст як є, alt="" -> порожній рядок, без атрибута -> null', () => {
    expect(extract(loadFixture('images-mixed')).images.map((i) => i.alt)).toEqual([
      'Hero banner',
      '',
      null,
      'Без адреси',
      'Hero banner',
    ]);
  });
});

describe('images extract: адреса', () => {
  it('currentSrc (вибір зі srcset) важливіший за src', () => {
    const doc = parseHtml(
      '<base href="https://example.com/"><img src="small.jpg" srcset="big.jpg 2x">',
    );
    load(doc.querySelector('img')!, {
      width: 2000,
      height: 1000,
      currentSrc: 'https://example.com/big.jpg',
    });
    expect(extract(doc).images[0]!.src).toBe('https://example.com/big.jpg');
  });

  it('src з пробілів -> немає адреси', () => {
    expect(extract(parseHtml('<img src="  ">')).images[0]!.src).toBe('');
  });
});

describe('images extract: розміри і вага', () => {
  it('не завантажено: natural і bytes null', () => {
    timing({ 'https://example.com/blog/hero.jpg': 5000 });
    const image = extract(loadFixture('images-mixed')).images[0]!;
    expect(image.natural).toBeNull();
    expect(image.bytes).toBeNull();
  });

  it('завантажено: natural-розміри і encodedBodySize з Resource Timing', () => {
    timing({ 'https://example.com/blog/hero.jpg': 245_760 });
    const doc = loadFixture('images-mixed');
    load(doc.querySelector('img')!, { width: 1600, height: 900 });
    expect(extract(doc).images[0]).toMatchObject({
      natural: { width: 1600, height: 900 },
      bytes: 245_760,
    });
  });

  it('complete, але naturalWidth 0 (бите зображення): не завантажено', () => {
    const doc = parseHtml('<img src="https://example.com/broken.png">');
    load(doc.querySelector('img')!, { width: 0, height: 0 });
    expect(extract(doc).images[0]!.natural).toBeNull();
  });

  it('браузер не віддає вагу (немає запису або encodedBodySize 0): bytes null', () => {
    timing({ 'https://cdn.example.net/photo.webp': 0 });
    const doc = parseHtml(
      '<img src="https://cdn.example.net/photo.webp"><img src="https://example.com/cached.png">',
    );
    doc.querySelectorAll('img').forEach((img) => load(img, { width: 10, height: 10 }));
    expect(extract(doc).images.map((i) => i.bytes)).toEqual([null, null]);
  });

  it('без Resource Timing у середовищі: bytes null', () => {
    vi.stubGlobal('performance', undefined);
    const doc = parseHtml('<img src="https://example.com/a.png">');
    load(doc.querySelector('img')!, { width: 10, height: 10 });
    expect(extract(doc).images[0]!.bytes).toBeNull();
  });

  it('data: URI у base64: вага з самого URI', () => {
    // "hello" = 5 байтів = "aGVsbG8=" у base64.
    const doc = parseHtml('<img src="data:image/png;base64,aGVsbG8=">');
    load(doc.querySelector('img')!, { width: 1, height: 1 });
    expect(extract(doc).images[0]!.bytes).toBe(5);
  });

  it('data: URI без base64: вага декодованого тексту', () => {
    // %3C і %3E — по одному байту.
    const doc = parseHtml(`<img src="data:image/svg+xml,%3Csvg%3E">`);
    load(doc.querySelector('img')!, { width: 1, height: 1 });
    expect(extract(doc).images[0]!.bytes).toBe(5);
  });
});
