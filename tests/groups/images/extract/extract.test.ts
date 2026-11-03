import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

/**
 * HTTP-кеш браузера для `fetch(src, { cache: 'force-cache' })`: файл відомої ваги для кожного URL.
 * Інших URL у кеші немає, і `fetch` для них падає, як cross-origin без CORS.
 */
function cache(sizes: Record<string, number>) {
  const fetch = vi.fn(async (url: string, init?: RequestInit) => {
    if (!(url in sizes) || init?.cache !== 'force-cache') throw new TypeError('Load failed');
    return new Response(new Uint8Array(sizes[url]!));
  });
  vi.stubGlobal('fetch', fetch);
  return fetch;
}

beforeEach(() => {
  cache({});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('images extract: які Images і в якому порядку', () => {
  it('лише <img>, у порядку документа, повтори окремо; svg, CSS-фон, input[type=image], favicon пропущено', async () => {
    expect((await extract(loadFixture('images-mixed'))).images.map((i) => i.src)).toEqual([
      'https://example.com/blog/hero.jpg',
      'https://example.com/img/decor.png',
      'https://cdn.example.net/photo.webp',
      '',
      'https://example.com/blog/hero.jpg',
    ]);
  });

  it('у <picture> лише <img>, <source> не є Image', async () => {
    const doc = parseHtml(
      '<base href="https://example.com/"><picture><source srcset="b.webp"><img src="b.png"></picture>',
    );
    expect((await extract(doc)).images.map((i) => i.src)).toEqual(['https://example.com/b.png']);
  });

  it('сторінка без <img>: порожній список', async () => {
    expect((await extract(parseHtml('<p>text</p>'))).images).toEqual([]);
  });
});

describe('images extract: alt', () => {
  it('текст як є, alt="" -> порожній рядок, без атрибута -> null', async () => {
    expect((await extract(loadFixture('images-mixed'))).images.map((i) => i.alt)).toEqual([
      'Hero banner',
      '',
      null,
      'Без адреси',
      'Hero banner',
    ]);
  });
});

describe('images extract: адреса', () => {
  it('currentSrc (вибір зі srcset) важливіший за src', async () => {
    const doc = parseHtml(
      '<base href="https://example.com/"><img src="small.jpg" srcset="big.jpg 2x">',
    );
    load(doc.querySelector('img')!, {
      width: 2000,
      height: 1000,
      currentSrc: 'https://example.com/big.jpg',
    });
    expect((await extract(doc)).images[0]!.src).toBe('https://example.com/big.jpg');
  });

  it('src з пробілів -> немає адреси', async () => {
    expect((await extract(parseHtml('<img src="  ">'))).images[0]!.src).toBe('');
  });
});

describe('images extract: розміри і вага', () => {
  it('не завантажено: natural і bytes null', async () => {
    timing({ 'https://example.com/blog/hero.jpg': 5000 });
    const image = (await extract(loadFixture('images-mixed'))).images[0]!;
    expect(image.natural).toBeNull();
    expect(image.bytes).toBeNull();
  });

  it('завантажено: natural-розміри і encodedBodySize з Resource Timing', async () => {
    timing({ 'https://example.com/blog/hero.jpg': 245_760 });
    const doc = loadFixture('images-mixed');
    load(doc.querySelector('img')!, { width: 1600, height: 900 });
    expect((await extract(doc)).images[0]).toMatchObject({
      natural: { width: 1600, height: 900 },
      bytes: 245_760,
    });
  });

  it('complete, але naturalWidth 0 (бите зображення): не завантажено', async () => {
    const doc = parseHtml('<img src="https://example.com/broken.png">');
    load(doc.querySelector('img')!, { width: 0, height: 0 });
    expect((await extract(doc)).images[0]!.natural).toBeNull();
  });

  it('браузер не віддає вагу (немає запису або encodedBodySize 0): bytes null', async () => {
    timing({ 'https://cdn.example.net/photo.webp': 0 });
    const doc = parseHtml(
      '<img src="https://cdn.example.net/photo.webp"><img src="https://example.com/cached.png">',
    );
    doc.querySelectorAll('img').forEach((img) => load(img, { width: 10, height: 10 }));
    expect((await extract(doc)).images.map((i) => i.bytes)).toEqual([null, null]);
  });

  it('без Resource Timing у середовищі: bytes null', async () => {
    vi.stubGlobal('performance', undefined);
    const doc = parseHtml('<img src="https://example.com/a.png">');
    load(doc.querySelector('img')!, { width: 10, height: 10 });
    expect((await extract(doc)).images[0]!.bytes).toBeNull();
  });

  it('data: URI у base64: вага з самого URI', async () => {
    // "hello" = 5 байтів = "aGVsbG8=" у base64.
    const doc = parseHtml('<img src="data:image/png;base64,aGVsbG8=">');
    load(doc.querySelector('img')!, { width: 1, height: 1 });
    expect((await extract(doc)).images[0]!.bytes).toBe(5);
  });

  it('data: URI без base64: вага декодованого тексту', async () => {
    // %3C і %3E — по одному байту.
    const doc = parseHtml(`<img src="data:image/svg+xml,%3Csvg%3E">`);
    load(doc.querySelector('img')!, { width: 1, height: 1 });
    expect((await extract(doc)).images[0]!.bytes).toBe(5);
  });
});

// Safari для картинки з кешу дає запис Resource Timing з нулями
// (encodedBodySize, decodedBodySize і transferSize), навіть для same-origin.
describe('images extract: вага з кешу, коли Resource Timing дає 0', () => {
  it('Safari, картинка з кешу: вага з fetch force-cache', async () => {
    timing({ 'https://example.com/cached.png': 0 });
    cache({ 'https://example.com/cached.png': 30_400 });
    const doc = parseHtml('<img src="https://example.com/cached.png">');
    load(doc.querySelector('img')!, { width: 10, height: 10 });
    expect((await extract(doc)).images[0]!.bytes).toBe(30_400);
  });

  it('однакова адреса в кількох Images: файл з кешу читається один раз', async () => {
    const fetch = cache({ 'https://example.com/logo.svg': 2640 });
    const doc = parseHtml(
      '<img src="https://example.com/logo.svg"><img src="https://example.com/logo.svg">',
    );
    doc.querySelectorAll('img').forEach((img) => load(img, { width: 10, height: 10 }));
    expect((await extract(doc)).images.map((i) => i.bytes)).toEqual([2640, 2640]);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('Image не завантажено: кеш не читається, Page нічого не довантажує', async () => {
    const fetch = cache({ 'https://example.com/lazy.png': 100 });
    await extract(parseHtml('<img src="https://example.com/lazy.png" loading="lazy">'));
    expect(fetch).not.toHaveBeenCalled();
  });

  it('вага є в Resource Timing: кеш не читається', async () => {
    timing({ 'https://example.com/a.png': 98 });
    const fetch = cache({ 'https://example.com/a.png': 98 });
    const doc = parseHtml('<img src="https://example.com/a.png">');
    load(doc.querySelector('img')!, { width: 10, height: 10 });
    expect((await extract(doc)).images[0]!.bytes).toBe(98);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('файлу немає в кеші і мережа віддає помилку (404): bytes null', async () => {
    vi.stubGlobal('fetch', async () => new Response('gone', { status: 404 }));
    const doc = parseHtml('<img src="https://example.com/gone.png">');
    load(doc.querySelector('img')!, { width: 10, height: 10 });
    expect((await extract(doc)).images[0]!.bytes).toBeNull();
  });
});
