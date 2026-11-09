import { fireEvent, render, screen, waitFor, within } from '@testing-library/preact';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Row } from '../../src/ui/Row';
import { Table } from '../../src/ui/Table';
import type { RowView } from '../../src/ui/types';

function renderRow(row: RowView) {
  render(
    <table>
      <tbody>
        <Row row={row} />
      </tbody>
    </table>,
  );
  return screen.getByRole('row');
}

describe('Row', () => {
  it('Missing: назва Metric і бейдж в лівій колонці, правая порожня', () => {
    const tr = renderRow({
      id: 'title',
      label: 'Title',
      badges: [{ text: 'Missing', tone: 'warn' }],
      values: [],
    });
    const header = within(tr).getByRole('rowheader');
    expect(within(header).getByText('Title')).toBeTruthy();
    expect(within(header).getByText('Missing')).toBeTruthy();
    expect(within(tr).getByRole('cell').textContent).toBe('');
  });

  it('Duplicate і Length rating: бейджі під назвою, значення у правій колонці', () => {
    const tr = renderRow({
      id: 'title',
      label: 'Title',
      badges: [
        { text: 'Duplicate ×2', tone: 'warn' },
        { text: '40 chars · Good', tone: 'good' },
      ],
      values: [{ kind: 'text', text: 'First title' }],
    });
    const header = within(tr).getByRole('rowheader');
    expect(within(header).getByText('Duplicate ×2')).toBeTruthy();
    expect(within(header).getByText('40 chars · Good')).toBeTruthy();
    expect(within(within(tr).getByRole('cell')).getByText('First title')).toBeTruthy();
  });

  it('значення-бейдж показується замість тексту', () => {
    const tr = renderRow({
      id: 'canonical',
      label: 'Canonical',
      badges: [],
      values: [{ kind: 'badge', badge: { text: 'Empty', tone: 'warn' } }],
    });
    expect(within(within(tr).getByRole('cell')).getByText('Empty')).toBeTruthy();
  });
});

describe('Row: Length rating', () => {
  it('бейдж `N chars · Good` текстом під назвою Description', () => {
    const tr = renderRow({
      id: 'description',
      label: 'Description',
      badges: [{ text: '120 chars · Good', tone: 'good' }],
      values: [{ kind: 'text', text: 'Some description' }],
    });
    const header = within(tr).getByRole('rowheader');
    expect(within(header).getByText('Description')).toBeTruthy();
    expect(within(header).getByText('120 chars · Good')).toBeTruthy();
  });
});

describe('Table', () => {
  it('count показано в лівій колонці, а Empty-запис має текстовий префікс перед бейджем', () => {
    const tr = renderRow({
      id: 'hreflang',
      label: 'hreflang',
      count: 2,
      badges: [],
      values: [
        { kind: 'text', text: 'en → https://example.com/en' },
        { kind: 'badge', prefix: 'de → ', badge: { text: 'Empty', tone: 'warn' } },
      ],
    });
    expect(within(within(tr).getByRole('rowheader')).getByText('2')).toBeTruthy();
    const cell = within(tr).getByRole('cell');
    expect(cell.textContent).toBe('en → https://example.com/ende → Empty');
  });
});

describe('Row: копіювання', () => {
  const row: RowView = {
    id: 'title',
    label: 'Title',
    badges: [{ text: '13 chars · Short', tone: 'warn' }],
    values: [{ kind: 'text', text: 'Best cat food' }],
    copy: 'Best cat food',
  };

  function stubClipboard(writeText: (text: string) => Promise<void>) {
    const spy = vi.fn(writeText);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: spy },
      configurable: true,
    });
    return spy;
  }

  afterEach(() => {
    vi.useRealTimers();
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  it('без copy кнопки немає', () => {
    const tr = renderRow({ ...row, copy: undefined });
    expect(within(tr).queryByRole('button')).toBeNull();
  });

  it('кнопка Copy у лівій колонці кладе copy в буфер обміну і стає Copied', async () => {
    const writeText = stubClipboard(() => Promise.resolve());
    const tr = renderRow(row);
    const button = within(within(tr).getByRole('rowheader')).getByRole('button', { name: 'Copy' });
    fireEvent.click(button);
    expect(writeText).toHaveBeenCalledWith('Best cat food');
    await waitFor(() => expect(button.getAttribute('aria-label')).toBe('Copied'));
  });

  it('відмова буфера обміну: кнопка стає Copy failed', async () => {
    stubClipboard(() => Promise.reject(new Error('denied')));
    const tr = renderRow(row);
    const button = within(tr).getByRole('button', { name: 'Copy' });
    fireEvent.click(button);
    await waitFor(() => expect(button.getAttribute('aria-label')).toBe('Copy failed'));
  });

  it('буфера обміну немає: кнопка стає Copy failed', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    const tr = renderRow(row);
    const button = within(tr).getByRole('button', { name: 'Copy' });
    fireEvent.click(button);
    await waitFor(() => expect(button.getAttribute('aria-label')).toBe('Copy failed'));
  });

  it('через 1,5 с кнопка повертається до Copy', async () => {
    vi.useFakeTimers();
    stubClipboard(() => Promise.resolve());
    const tr = renderRow(row);
    const button = within(tr).getByRole('button', { name: 'Copy' });
    fireEvent.click(button);
    await vi.advanceTimersByTimeAsync(0);
    expect(button.getAttribute('aria-label')).toBe('Copied');
    await vi.advanceTimersByTimeAsync(1500);
    expect(button.getAttribute('aria-label')).toBe('Copy');
  });
});
