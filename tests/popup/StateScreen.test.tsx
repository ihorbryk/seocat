import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { StateScreen } from '../../src/popup/StateScreen';

describe('StateScreen', () => {
  it('unreadable: URL, заголовок і один рядок пояснення', () => {
    render(<StateScreen url="favorites://" outcome={{ kind: 'unreadable' }} />);
    expect(screen.getByTestId('url').textContent).toBe('favorites://');
    expect(screen.getByRole('heading').textContent).toBe("Can't read this page");
    expect(screen.getByText("Safari doesn't let extensions access this page.")).toBeTruthy();
  });

  it('без tab.url блок URL не рендериться', () => {
    render(<StateScreen outcome={{ kind: 'unreadable' }} />);
    expect(screen.queryByTestId('url')).toBeNull();
  });

  it('not-html: contentType у реченні', () => {
    render(
      <StateScreen
        url="https://example.com/a.pdf"
        outcome={{ kind: 'not-html', contentType: 'application/pdf' }}
      />,
    );
    expect(screen.getByRole('heading').textContent).toBe('Not an HTML page');
    const type = screen.getByText('application/pdf');
    expect(type.tagName).toBe('CODE');
    expect(type.parentElement?.textContent).toBe(
      'seocat measures HTML documents. This one is application/pdf.',
    );
  });

  it('failed: сирий message', () => {
    render(
      <StateScreen url="https://example.com/" outcome={{ kind: 'failed', message: 'boom' }} />,
    );
    expect(screen.getByRole('heading').textContent).toBe("Couldn't measure this page");
    const msg = screen.getByText('boom');
    expect(msg.tagName).toBe('SPAN');
  });
});
