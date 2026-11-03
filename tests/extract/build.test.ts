import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { build } from 'vite';
import { beforeAll, expect, it } from 'vitest';

// Збирає справжній бандл один раз на файл, тому повільніший за інші тести.
let code: string;
beforeAll(async () => {
  const outDir = mkdtempSync(join(tmpdir(), 'seocat-extract-'));
  await build({
    configFile: resolve(import.meta.dirname, '../../vite.config.ts'),
    mode: 'extract',
    logLevel: 'silent',
    build: { outDir, emptyOutDir: true },
  });
  code = readFileSync(join(outDir, 'extract.js'), 'utf8');
}, 30_000);

// Охороняє ADR 0004: у бандл, що інжектується в Page, не потрапляє код попапа.
// Без мініфікації Rollup підписує кожен модуль коментарем `// <шлях>`.
it('extract.js не містить preact, src/ui/ і половини попапа Groups', () => {
  const modules = [...code.matchAll(/^\s*\/\/ (\S+)$/gm)].map((m) => m[1]);
  expect(modules.length).toBeGreaterThan(0);
  expect(
    modules.filter((m) =>
      /node_modules\/preact|^src\/ui\/|\/(assess|View|Header|popup)\b/.test(m!),
    ),
  ).toEqual([]);
});

// Охороняє контракт ADR 0001: останній вираз зібраного extract.js обчислюється в конверт
// (саме це читає executeScript).
it('зібраний extract.js обчислюється в конверт ok', () => {
  const dom = new JSDOM('<!doctype html><title>Built</title>', {
    url: 'https://example.com/x?y=1#z',
    runScripts: 'outside-only',
  });
  const result = dom.window.eval(code);

  expect(JSON.parse(JSON.stringify(result))).toEqual({
    kind: 'ok',
    groups: {
      content: {
        title: { count: 1, value: 'Built' },
        description: { count: 0, value: null },
        words: 0,
        images: 0,
        links: 0,
        headings: [0, 0, 0, 0, 0, 0],
      },
      indexing: { canonical: [], robots: [], hreflang: [] },
      images: { images: [] },
    },
  });
});
