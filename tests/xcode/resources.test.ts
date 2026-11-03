import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';

const repo = join(import.meta.dirname, '../..');

// Xcode-проєкт посилається на dist/ без копіювання (ADR 0001), тож кожен файл,
// який потрібен розширенню, має бути серед ресурсів "seocat Extension".
// Без цього збірка Xcode мовчки пропускає файл, хоча `mise run dev` працює.
it('Xcode-проєкт містить у ресурсах усе, на що посилається розширення', () => {
  const project = readFileSync(
    join(repo, 'xcode/seocat/seocat.xcodeproj/project.xcproj'),
    'utf8',
  );
  const listed = new Set(
    [...project.matchAll(/"path": "\.\.\/\.\.\/\.\.\/dist\/([^"]+)"/g)].map((m) => m[1]),
  );

  const manifest = JSON.parse(readFileSync(join(repo, 'public/manifest.json'), 'utf8'));
  const needed = [
    'manifest.json',
    'extract.js', // інжектується через scripting.executeScript у src/popup/App.tsx
    manifest.action.default_popup,
    ...Object.values<string>(manifest.action.default_icon),
    ...Object.values<string>(manifest.icons),
  ];

  for (const file of needed) {
    expect(listed, `dist/${file}`).toContain(file.split('/')[0]);
  }
});
