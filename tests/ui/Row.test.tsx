import { render, screen, within } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
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
  it('малює рядок-розділювач секції і її рядки', () => {
    render(
      <Table
        sections={[
          {
            id: 'meta',
            title: 'Meta',
            rows: [
              { id: 'title', label: 'Title', badges: [], values: [{ kind: 'text', text: 'Hi' }] },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByText('Meta')).toBeTruthy();
    expect(screen.getByText('Hi')).toBeTruthy();
  });
});
