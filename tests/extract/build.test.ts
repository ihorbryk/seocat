import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { build } from 'vite';
import { expect, it } from 'vitest';

// Охороняє контракт ADR 0001: останній вираз зібраного extract.js обчислюється в конверт
// (саме це читає executeScript). Збирає справжній бандл, тому повільніший за інші тести.
it('зібраний extract.js обчислюється в конверт ok', async () => {
  const outDir = mkdtempSync(join(tmpdir(), 'seocat-extract-'));
  await build({
    configFile: resolve(import.meta.dirname, '../../vite.config.ts'),
    mode: 'extract',
    logLevel: 'silent',
    build: { outDir, emptyOutDir: true },
  });
  const code = readFileSync(join(outDir, 'extract.js'), 'utf8');

  const dom = new JSDOM('<!doctype html><title>Built</title>', {
    url: 'https://example.com/x?y=1#z',
    runScripts: 'outside-only',
  });
  const result = dom.window.eval(code);

  expect(JSON.parse(JSON.stringify(result))).toEqual({
    kind: 'ok',
    groups: {
      'seo-basics': {
        url: 'https://example.com/x?y=1#z',
        title: { count: 1, value: 'Built' },
        canonical: [],
        robots: [],
        hreflang: [],
        description: { count: 0, value: null },
        words: 0,
        images: 0,
        links: 0,
        headings: [0, 0, 0, 0, 0, 0],
      },
    },
  });
}, 30_000);
