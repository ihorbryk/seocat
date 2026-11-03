import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { Popup } from '../../src/popup/Popup';
import { snapshot } from '../snapshot';

describe('Popup', () => {
  it('ok: хедер Group з URL Page і таблиця, без екрана стану', () => {
    render(
      <Popup
        url="https://example.com/tab"
        outcome={{
          kind: 'ok',
          groups: { 'seo-basics': snapshot({ url: 'https://example.com/page' }) },
        }}
      />,
    );
    expect(screen.getByTestId('url').textContent).toBe('https://example.com/page');
    expect(screen.getByRole('table')).toBeTruthy();
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('не-ok: екран стану з URL вкладки', () => {
    render(<Popup url="favorites://" outcome={{ kind: 'unreadable' }} />);
    expect(screen.getByTestId('url').textContent).toBe('favorites://');
    expect(screen.getByRole('heading').textContent).toBe("Can't read this page");
  });
});
