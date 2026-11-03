import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { generateIcons } from '../../scripts/icons';

const repo = join(import.meta.dirname, '../..');
const appiconset = 'xcode/seocat/seocat/Assets.xcassets/AppIcon.appiconset';

function pngSize(path: string) {
  const buf = readFileSync(path);
  expect(buf.subarray(1, 4).toString()).toBe('PNG');
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

describe('generateIcons', () => {
  let root: string;
  // Рендер усіх PNG синхронний і займає ~6–8 с, а паралельно з tsc і Prettier
  // (pre-commit хук) виходить за стандартні 10 с хука Vitest.
  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'seocat-icons-'));
    generateIcons(root);
  }, 60_000);

  it('renders toolbar PNGs at 16, 19, 32, 38 px', () => {
    for (const n of [16, 19, 32, 38]) {
      expect(pngSize(join(root, `public/icons/toolbar-${n}.png`))).toEqual([n, n]);
    }
  });

  it('renders app PNGs at 48, 64, 96, 128, 256, 512 px', () => {
    for (const n of [48, 64, 96, 128, 256, 512]) {
      expect(pngSize(join(root, `public/icons/app-${n}.png`))).toEqual([n, n]);
    }
  });

  it('renders the wrapper window image at 384 px', () => {
    expect(pngSize(join(root, 'xcode/seocat/seocat/Resources/Icon.png'))).toEqual([384, 384]);
  });

  it('writes the 10 macOS AppIcon files and a matching Contents.json', () => {
    const dir = join(root, appiconset);
    const contents = JSON.parse(readFileSync(join(dir, 'Contents.json'), 'utf8'));
    expect(contents.images).toHaveLength(10);
    for (const img of contents.images) {
      const pt = Number.parseInt(img.size, 10);
      const scale = Number.parseInt(img.scale, 10);
      expect(img.idiom).toBe('mac');
      expect(pngSize(join(dir, img.filename))).toEqual([pt * scale, pt * scale]);
    }
    expect(contents.images.map((i: { size: string }) => i.size)).toContain('512x512');
  });
});

describe('committed icons', () => {
  it('manifest references existing default_icon and icons files of all sizes', () => {
    const manifest = JSON.parse(readFileSync(join(repo, 'public/manifest.json'), 'utf8'));
    expect(Object.keys(manifest.action.default_icon)).toEqual(['16', '19', '32', '38']);
    expect(Object.keys(manifest.icons)).toEqual(['48', '64', '96', '128', '256', '512']);
    for (const p of [
      ...Object.values<string>(manifest.action.default_icon),
      ...Object.values<string>(manifest.icons),
    ]) {
      expect(existsSync(join(repo, 'public', p))).toBe(true);
    }
    expect(manifest.name).toBe('seocat');
    expect(manifest.description).toBe('Shows SEO facts about the current page.');
  });
});
