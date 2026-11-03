import { render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../../src/popup/App';

function stubBrowser(query: () => Promise<unknown[]>) {
  vi.stubGlobal('browser', { tabs: { query }, scripting: { executeScript: vi.fn() } });
}

describe('App', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('tabs.query відхилено: екран Unreadable, а не порожній попап', async () => {
    stubBrowser(() => Promise.reject(new Error('nope')));
    render(<App />);
    expect((await screen.findByRole('heading')).textContent).toBe("Can't read this page");
  });

  it('вкладки немає: екран Unreadable', async () => {
    stubBrowser(() => Promise.resolve([]));
    render(<App />);
    expect((await screen.findByRole('heading')).textContent).toBe("Can't read this page");
  });
});
