import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { version } from '../../public/manifest.json';

const repo = join(import.meta.dirname, '../..');

// Джерело правди для версії — manifest; бандли застосунку і розширення беруть її з MARKETING_VERSION.
// Обидва таргети (застосунок і розширення) мають збігатися з manifest, а
// `mise run xcode:init` повертає їм 1.0, тож тест ловить і такий відкат.
it('MARKETING_VERSION обох таргетів Xcode дорівнює версії з manifest', () => {
  const project = readFileSync(
    join(repo, 'xcode/seocat/seocat.xcodeproj/project.xcproj'),
    'utf8',
  );
  const versions = [...project.matchAll(/"MARKETING_VERSION": "([^"]+)"/g)].map((m) => m[1]);

  expect(versions.length).toBeGreaterThanOrEqual(2);
  expect(versions).toEqual(versions.map(() => version));
});
