import type { FrameResult, TabPort } from './measure';

/** Адаптер `TabPort` над `browser.*` Safari. Єдине місце попапа, що звертається до браузера. */
export const browserPort: TabPort = {
  async activeTab() {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    return tab;
  },
  // Два кроки (ADR 0001): `extract.js` реєструє `__seocatMeasure`, а `func` викликає її і повертає
  // Promise конверта. `func` Safari серіалізує через `toString()`, тож ім'я глобалі — літерал.
  async executeScript(tabId) {
    const loaded: readonly FrameResult[] = await browser.scripting.executeScript({
      target: { tabId },
      files: ['extract.js'],
    });
    if (loaded[0]?.result !== true) return loaded;
    return browser.scripting.executeScript({
      target: { tabId },
      func: () => globalThis.__seocatMeasure?.(),
    });
  },
};
