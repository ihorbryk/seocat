import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const repo = join(import.meta.dirname, '..');

export const TOOLBAR_SIZES = [16, 19, 32, 38];
export const APP_SIZES = [48, 64, 96, 128, 256, 512];
const APPICONSET = 'xcode/seocat/seocat/Assets.xcassets/AppIcon.appiconset';
const MAC_POINTS = [16, 32, 128, 256, 512];

function render(svgName: string, px: number): Buffer {
  const svg = readFileSync(join(repo, 'assets/icons', svgName));
  return new Resvg(svg, { fitTo: { mode: 'width', value: px } }).render().asPng();
}

/** Рендерить PNG з assets/icons/*.svg у `root` (за замовчуванням корінь репозиторію). */
export function generateIcons(root: string = repo): void {
  const icons = join(root, 'public/icons');
  mkdirSync(icons, { recursive: true });
  for (const n of TOOLBAR_SIZES)
    writeFileSync(join(icons, `toolbar-${n}.png`), render('toolbar.svg', n));
  for (const n of APP_SIZES) writeFileSync(join(icons, `app-${n}.png`), render('app.svg', n));

  // Зображення у вікні застосунку-обгортки (Resources/Icon.png, 128pt @3x).
  const resources = join(root, 'xcode/seocat/seocat/Resources');
  mkdirSync(resources, { recursive: true });
  writeFileSync(join(resources, 'Icon.png'), render('app.svg', 384));

  const set = join(root, APPICONSET);
  mkdirSync(set, { recursive: true });
  const images = MAC_POINTS.flatMap((pt) =>
    [1, 2].map((scale) => {
      const filename = `icon_${pt}x${pt}${scale === 2 ? '@2x' : ''}.png`;
      writeFileSync(join(set, filename), render('app.svg', pt * scale));
      return { filename, idiom: 'mac', scale: `${scale}x`, size: `${pt}x${pt}` };
    }),
  );
  writeFileSync(
    join(set, 'Contents.json'),
    JSON.stringify({ images, info: { author: 'xcode', version: 1 } }, null, 2) + '\n',
  );
}

if (process.argv[1] === import.meta.filename) generateIcons();
