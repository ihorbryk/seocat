import type { TabPort } from './measure';

/** Адаптер `TabPort` над `browser.*` Safari. Єдине місце попапа, що звертається до браузера. */
export const browserPort: TabPort = {
  async activeTab() {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    return tab;
  },
  executeScript: (tabId) =>
    browser.scripting.executeScript({ target: { tabId }, files: ['extract.js'] }),
};
