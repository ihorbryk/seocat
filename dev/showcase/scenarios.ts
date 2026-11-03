import type { Outcome } from '../../src/extract/envelope';
import { okOutcome } from '../../tests/snapshot';

/** Стан попапа для showcase: `?scenario=<id>`. Дані — з `.scratch/seocat-v1/prototypes/popup-layout-PROTOTYPE.html` (варіант D). */
export interface Scenario {
  id: string;
  /** Що перевіряти на знімку. */
  note: string;
  /** URL вкладки Safari (смуга під рядком версії). */
  url?: string;
  outcome: Outcome;
}

const HEAVY_BASE =
  'https://www.example-media-group.com.ua/novyny/ekonomika/2026/11/03/yak-shtuchnyi-intelekt-zminiuie-rynok-pratsi';
const HEAVY_URL = `${HEAVY_BASE}?utm_source=newsletter&utm_medium=email&utm_campaign=daily-digest#comments`;
const HEAVY_LANGS = ['uk', 'en', 'en-GB', 'de', 'fr', 'pl', 'es', 'it', 'pt-BR', 'cs', 'ro'];

export const scenarios: Scenario[] = [
  {
    id: 'healthy',
    note: 'Усе Good, по одному тегу',
    url: 'https://example.com/blog/safari-extensions-guide',
    outcome: okOutcome({
      content: {
        title: { count: 1, value: 'How to Build a Safari Web Extension in 2026 | Example Blog' },
        description: {
          count: 1,
          value:
            'A step-by-step guide to building, signing and running a Safari Web Extension on macOS with TypeScript and Vite, from manifest to Xcode wrapper.',
        },
        words: 1842,
        images: 14,
        links: 87,
        headings: [1, 6, 11, 0, 0, 0],
      },
      indexing: {
        canonical: ['https://example.com/blog/safari-extensions-guide'],
        hreflang: [
          { code: 'en', href: 'https://example.com/blog/safari-extensions-guide' },
          { code: 'uk', href: 'https://example.com/uk/blog/safari-extensions-guide' },
          { code: 'x-default', href: 'https://example.com/blog/safari-extensions-guide' },
        ],
        robots: [{ name: 'robots', content: 'index, follow, max-image-preview:large' }],
      },
    }),
  },
  {
    id: 'problems',
    note: 'Missing, Empty, Duplicate; title Short, description Long',
    url: 'https://shop.example.com/products?id=8812',
    outcome: okOutcome({
      content: {
        title: { count: 2, value: 'Buy' },
        description: {
          count: 1,
          value:
            'Buy product 8812 at Example Shop: free delivery, 30-day returns, secure checkout, gift wrapping, loyalty points and the best prices on everything you need for home, garden and office.',
        },
        words: 37,
        images: 0,
        links: 212,
        headings: [0, 0, 2, 0, 0, 0],
      },
      indexing: {
        canonical: ['', 'https://shop.example.com/products'],
        hreflang: [],
        robots: [
          { name: 'robots', content: '' },
          { name: 'googlebot', content: 'noindex' },
        ],
      },
    }),
  },
  {
    id: 'heavy',
    note: 'Довгі URL і значення, багато тегів (Duplicate canonical), великі лічильники',
    url: HEAVY_URL,
    outcome: okOutcome({
      content: {
        title: {
          count: 1,
          value:
            'Як штучний інтелект змінює ринок праці в Україні: аналітика, прогнози та думки експертів 👍🏽',
        },
        description: { count: 1, value: 'Огляд того, як ШІ впливає на зайнятість.' },
        words: 12403,
        images: 63,
        links: 1488,
        headings: [2, 18, 41, 7, 1, 0],
      },
      indexing: {
        canonical: [
          HEAVY_BASE,
          `${HEAVY_BASE}?page=2`,
          `https://m.example-media-group.com.ua/novyny`,
        ],
        hreflang: [...HEAVY_LANGS, 'x-default', 'EN_us', 'ua'].map((code) => ({
          code,
          href: `https://www.example-media-group.com.ua/${code.toLowerCase()}/novyny/ekonomika/2026/11/03/yak-shtuchnyi-intelekt`,
        })),
        robots: [
          {
            name: 'robots',
            content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
          },
          { name: 'googlebot', content: 'index, follow' },
          { name: 'googlebot-news', content: 'nosnippet' },
          { name: 'bingbot', content: 'noarchive' },
        ],
      },
    }),
  },
  {
    id: 'images',
    note: 'Images: усі стани alt, адреси і ваги; > 1 MB червоним (вкладка images)',
    url: 'https://example.com/gallery',
    outcome: okOutcome({
      images: {
        images: [
          {
            src: 'https://picsum.photos/id/10/1600/900',
            alt: 'Ранковий ліс над озером',
            natural: { width: 1600, height: 900 },
            bytes: 250_880,
          },
          {
            src: 'https://picsum.photos/id/29/4000/2667',
            alt: null,
            natural: { width: 4000, height: 2667 },
            bytes: 2_412_544,
          },
          {
            src: 'https://example.com/img/divider.svg',
            alt: '',
            natural: { width: 640, height: 8 },
            bytes: 812,
          },
          {
            src: 'https://cdn.example.net/assets/products/2026/11/very-long-file-name-for-wrapping-check-final-v2.webp',
            alt: 'Довгий alt, який має перенестися на кілька рядків і не вийти за межі попапа шириною 460 пікселів',
            natural: { width: 1200, height: 1200 },
            bytes: null,
          },
          {
            src: 'https://example.com/img/below-the-fold.jpg',
            alt: 'Lazy-зображення нижче першого екрана',
            natural: null,
            bytes: null,
          },
          {
            src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            alt: 'Піксель',
            natural: { width: 1, height: 1 },
            bytes: 70,
          },
          { src: '', alt: null, natural: null, bytes: null },
        ],
      },
    }),
  },
  {
    id: 'unreadable',
    note: 'Unreadable: внутрішня сторінка Safari',
    url: 'favorites://',
    outcome: { kind: 'unreadable' },
  },
  {
    id: 'not-html',
    note: 'Not HTML: PDF',
    url: 'https://example.com/files/annual-report-2026.pdf',
    outcome: { kind: 'not-html', contentType: 'application/pdf' },
  },
  {
    id: 'failed',
    note: 'Збій вимірювання: довге повідомлення',
    url: 'https://example.com/app',
    outcome: {
      kind: 'failed',
      message:
        "TypeError: Cannot read properties of null (reading 'getAttribute') at extractCanonical (extract.js:142:31) at extract (extract.js:388:15) at https://example.com/app/very/long/path/that/should/wrap/anywhere/without/overflowing/the/popup",
    },
  },
];
