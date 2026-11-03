import { describe, expect, it } from 'vitest';
import { readLastTab, writeLastTab } from '../../src/popup/last-tab';

/** Мінімальний `Storage` у пам'яті. */
function memoryStorage(initial: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(initial));
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => void data.delete(k),
    setItem: (k, v) => void data.set(k, v),
  };
}

const broken = {
  getItem() {
    throw new Error('SecurityError');
  },
  setItem() {
    throw new Error('QuotaExceededError');
  },
} as unknown as Storage;

describe('остання вкладка', () => {
  it('нічого не збережено: Content', () => {
    expect(readLastTab(memoryStorage())).toBe('content');
  });

  it('записане значення читається назад', () => {
    const storage = memoryStorage();
    writeLastTab(storage, 'indexing');
    expect(readLastTab(storage)).toBe('indexing');
  });

  it('невідомий id Group (перейменували чи видалили): Content', () => {
    const storage = memoryStorage();
    writeLastTab(storage, 'indexing');
    // Колишній id єдиної Group, який міг лишитися після оновлення.
    storage.setItem(storage.key(0)!, 'seo-basics');
    expect(readLastTab(storage)).toBe('content');
  });

  it('сховище кидає виняток: читання дає Content, запис не падає', () => {
    expect(readLastTab(broken)).toBe('content');
    expect(() => writeLastTab(broken, 'indexing')).not.toThrow();
  });

  it('сховища немає взагалі: Content', () => {
    expect(readLastTab(undefined)).toBe('content');
  });
});
