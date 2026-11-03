import type { GroupId } from '../groups/page-registry';
import { toGroupId } from '../groups/popup-registry';

const KEY = 'seocat:last-tab';

/**
 * Остання відкрита вкладка (id Group), одна на все розширення. Невідоме значення,
 * порожнє або недоступне сховище дають першу Group реєстру (Content).
 */
export function readLastTab(storage: Storage | undefined): GroupId {
  try {
    return toGroupId(storage?.getItem(KEY));
  } catch {
    return toGroupId(null);
  }
}

/** Запам'ятовує вкладку; збій сховища ігнорується (попап працює і без пам'яті). */
export function writeLastTab(storage: Storage | undefined, id: GroupId): void {
  try {
    storage?.setItem(KEY, id);
  } catch {
    // Приватний режим чи заблоковані дані сайту: просто не пам'ятаємо.
  }
}
