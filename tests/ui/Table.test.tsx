import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { Table } from '../../src/ui/Table';
import type { SectionView } from '../../src/ui/types';

const section = (id: string, title: string): SectionView => ({
  id,
  title,
  rows: [{ id: `${id}-row`, label: `${title} row`, badges: [], values: [] }],
});

describe('Table', () => {
  it('одна секція: без рядка-розділювача', () => {
    render(<Table sections={[section('meta', 'Meta')]} />);
    expect(screen.queryByRole('columnheader', { name: 'Meta' })).toBeNull();
    expect(screen.getByRole('rowheader', { name: 'Meta row' })).toBeTruthy();
  });

  it('кілька секцій: розділювач із назвою над кожною', () => {
    render(<Table sections={[section('meta', 'Meta'), section('headings', 'Headings')]} />);
    expect(screen.getByRole('columnheader', { name: 'Meta' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Headings' })).toBeTruthy();
  });
});
