import { describe, expect, it } from 'vitest';
import { staleRefs } from '../../scripts/check-docs';

const code = {
  exists: (path: string) => ['src/', 'src/popup/Popup.tsx', 'tests/snapshot.ts'].includes(path),
  inCode: (word: string) => ['Popup', 'TextTag'].includes(word),
};

describe('staleRefs', () => {
  it('шляхи і типи, які є в коді, не скаржаться', () => {
    const md =
      'Каркас — `src/popup/Popup.tsx` (`Popup`), поле `TextTag.value`, `tests/snapshot.ts`.';
    expect(staleRefs(md, code)).toEqual([]);
  });

  it('видалений шлях і зниклий тип ідуть у звіт', () => {
    const md = 'Поле в `PageSnapshot` (`src/groups/seo-basics/types.ts`).';
    expect(staleRefs(md, code)).toEqual(['PageSnapshot', 'src/groups/seo-basics/types.ts']);
  });

  it('шаблон із плейсхолдером перевіряється до першого `<`', () => {
    expect(staleRefs('`src/<context>/docs/adr/`', code)).toEqual([]);
    expect(staleRefs('`lib/<id>/`', code)).toEqual([]);
    expect(staleRefs('`tests/fixtures/<metric>.html`', code)).toEqual(['tests/fixtures/']);
  });

  it('звичайні слова в бектиках (команди, значення) ігноруються', () => {
    expect(staleRefs('`mise run check`, `index, follow`, `ok`', code)).toEqual([]);
  });

  it('назви файлів великими літерами (`GLOSSARY.md`, `README`) — не типи', () => {
    expect(staleRefs('`GLOSSARY.md`, `README`, `ADR`', code)).toEqual([]);
  });
});
