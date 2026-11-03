import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * Документація для агентів не повинна згадувати шляхи й типи, яких більше немає в коді
 * (перейменування Group лишило `PageSnapshot` в ADR). Перевіряються бектики двох видів:
 * шлях у `src/`, `tests/`, `dev/`, `public/`, `scripts/` (до першого плейсхолдера `<…>`)
 * і слово з великої літери (`Popup`, `TextTag.value` → `TextTag`).
 */
const PATH = /^(?:src|tests|dev|public|scripts)\//;
/** PascalCase: велика літера на початку і хоч одна мала (`GLOSSARY` — назва файлу, не тип). */
const TYPE = /^[A-Z](?=[A-Za-z0-9]*[a-z])[A-Za-z0-9]*$/;

export interface Code {
  exists(path: string): boolean;
  inCode(word: string): boolean;
}

/** Застарілі посилання з markdown-тексту, у порядку появи, без повторів. */
export function staleRefs(markdown: string, code: Code): string[] {
  const stale = new Set<string>();
  for (const [, ref] of markdown.matchAll(/`([^`\n]+)`/g)) {
    if (PATH.test(ref!)) {
      const path = ref!.split('<')[0]!;
      if (!code.exists(path)) stale.add(path);
      continue;
    }
    const word = ref!.split('.')[0]!;
    if (TYPE.test(word) && !code.inCode(word)) stale.add(word);
  }
  return [...stale];
}

const repo = join(import.meta.dirname, '..');
const DOCS = ['AGENTS.md', 'CODING_STANDARDS.md', 'docs'];
const CODE = ['src', 'tests', 'dev', 'scripts'];

function files(path: string, ext: RegExp): string[] {
  const full = join(repo, path);
  if (!existsSync(full)) return [];
  return readdirSync(full, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile() && ext.test(d.name))
    .map((d) => relative(repo, join(d.parentPath, d.name)));
}

function main(): void {
  const docs = DOCS.flatMap((p) => (p.endsWith('.md') ? [p] : files(p, /\.md$/)));
  const source = CODE.flatMap((p) => files(p, /\.(ts|tsx|css|html)$/))
    .filter((f) => f !== 'scripts/check-docs.ts' && f !== 'tests/scripts/check-docs.test.ts')
    .map((f) => readFileSync(join(repo, f), 'utf8'))
    .join('\n');
  const code: Code = {
    exists: (path) => existsSync(join(repo, path)),
    inCode: (word) => new RegExp(`\\b${word}\\b`).test(source),
  };
  let failed = false;
  for (const doc of docs) {
    const stale = staleRefs(readFileSync(join(repo, doc), 'utf8'), code);
    for (const ref of stale) console.error(`${doc}: \`${ref}\` немає в коді`);
    failed ||= stale.length > 0;
  }
  if (failed) process.exit(1);
}

if (import.meta.main) main();
