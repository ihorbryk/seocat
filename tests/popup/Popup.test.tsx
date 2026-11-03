import { fireEvent, render, screen, within } from '@testing-library/preact';
import { describe, expect, it, vi } from 'vitest';
import { Popup } from '../../src/popup/Popup';
import { version } from '../../public/manifest.json';
import { okOutcome } from '../snapshot';

const URL = 'https://example.com/a?b=1#c';
const ok = () => okOutcome({ indexing: { canonical: ['https://example.com/a'] } });

/** Чи йде `a` в документі раніше за `b`. */
const before = (a: Node, b: Node) =>
  Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

describe('Popup: каркас', () => {
  it.each([
    ['ok', URL, okOutcome()],
    ['не-ok', 'favorites://', { kind: 'unreadable' }],
    ['не-ok без URL', undefined, { kind: 'failed', message: 'boom' }],
  ] as const)('%s: першим рядком назва і версія з manifest', (_, url, outcome) => {
    const { container } = render(<Popup url={url} outcome={outcome} />);
    expect(container.textContent?.startsWith(`seocat ${version}`)).toBe(true);
    expect(screen.getByText(`seocat ${version}`).textContent).toBe(`seocat ${version}`);
  });

  it('ok: версія → URL вкладки → вкладки → таблиця', () => {
    render(<Popup url={URL} outcome={ok()} />);
    const versionLine = screen.getByText(`seocat ${version}`);
    const url = screen.getByTestId('url');
    const tabs = screen.getByRole('tablist');
    const table = screen.getByRole('table');
    expect(url.textContent).toBe(URL);
    expect(before(versionLine, url) && before(url, tabs) && before(tabs, table)).toBe(true);
  });

  it('не-ok: URL у тій самій смузі під версією, екран стану без вкладок', () => {
    render(<Popup url="favorites://" outcome={{ kind: 'unreadable' }} />);
    expect(screen.getAllByTestId('url').map((u) => u.textContent)).toEqual(['favorites://']);
    expect(before(screen.getByTestId('url'), screen.getByRole('heading'))).toBe(true);
    expect(screen.getByRole('heading').textContent).toBe("Can't read this page");
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  it('URL невідомий: смуги URL немає', () => {
    render(<Popup outcome={ok()} />);
    expect(screen.queryByTestId('url')).toBeNull();
  });
});

describe('Popup: вкладки', () => {
  it('вкладки Content і Indexing у порядку реєстру, за замовчуванням Content', () => {
    render(<Popup url={URL} outcome={ok()} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual(['Content', 'Indexing']);
    expect(screen.getByRole('tab', { selected: true }).textContent).toBe('Content');
    const panel = screen.getByRole('tabpanel');
    expect(within(panel).getByText('Title')).toBeTruthy();
    expect(within(panel).getByTestId('tile-words')).toBeTruthy();
    expect(within(panel).queryByText('Canonical')).toBeNull();
  });

  it('initialTab=indexing: таблиця Indexing без плиток і діаграми', () => {
    render(<Popup url={URL} outcome={ok()} initialTab="indexing" />);
    expect(screen.getByRole('tab', { selected: true }).textContent).toBe('Indexing');
    const panel = screen.getByRole('tabpanel');
    expect(within(panel).getByText('Canonical')).toBeTruthy();
    expect(within(panel).getByText('https://example.com/a')).toBeTruthy();
    expect(within(panel).queryByTestId('tile-words')).toBeNull();
    expect(within(panel).queryByText('Title')).toBeNull();
  });

  it('невідомий initialTab: Content', () => {
    // Колишній id єдиної Group: таке значення може лишитися в localStorage після оновлення.
    render(<Popup url={URL} outcome={ok()} initialTab="seo-basics" />);
    expect(screen.getByRole('tab', { selected: true }).textContent).toBe('Content');
  });

  it('клік по вкладці перемикає панель і повідомляє id Group', () => {
    const onTabChange = vi.fn();
    render(<Popup url={URL} outcome={ok()} onTabChange={onTabChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Indexing' }));
    expect(screen.getByRole('tab', { selected: true }).textContent).toBe('Indexing');
    expect(within(screen.getByRole('tabpanel')).getByText('Canonical')).toBeTruthy();
    expect(onTabChange).toHaveBeenCalledWith('indexing');
  });

  it('стрілки ←/→ перемикають вкладки по колу і переносять фокус', () => {
    const onTabChange = vi.fn();
    render(<Popup url={URL} outcome={ok()} onTabChange={onTabChange} />);
    const content = screen.getByRole('tab', { name: 'Content' });
    const indexing = screen.getByRole('tab', { name: 'Indexing' });

    fireEvent.keyDown(content, { key: 'ArrowRight' });
    expect(indexing.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(indexing);

    fireEvent.keyDown(indexing, { key: 'ArrowRight' });
    expect(content.getAttribute('aria-selected')).toBe('true');

    fireEvent.keyDown(content, { key: 'ArrowLeft' });
    expect(indexing.getAttribute('aria-selected')).toBe('true');
    expect(onTabChange.mock.calls).toEqual([['indexing'], ['content'], ['indexing']]);
  });

  it('панель підписана активною вкладкою, неактивна вкладка поза Tab-порядком', () => {
    render(<Popup url={URL} outcome={ok()} />);
    expect(screen.getByRole('tabpanel', { name: 'Content' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Content' }).getAttribute('tabindex')).toBe('0');
    expect(screen.getByRole('tab', { name: 'Indexing' }).getAttribute('tabindex')).toBe('-1');
  });
});
