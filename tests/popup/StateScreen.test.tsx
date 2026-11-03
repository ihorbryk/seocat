import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { StateScreen } from '../../src/popup/StateScreen';

describe('StateScreen', () => {
  it('unreadable: заголовок і один рядок пояснення, без URL (він у каркасі попапа)', () => {
    render(<StateScreen outcome={{ kind: 'unreadable' }} />);
    expect(screen.queryByTestId('url')).toBeNull();
    expect(screen.getByRole('heading').textContent).toBe("Can't read this page");
    expect(screen.getByText("Safari doesn't let extensions access this page.")).toBeTruthy();
  });

  it('not-html: contentType у реченні', () => {
    render(<StateScreen outcome={{ kind: 'not-html', contentType: 'application/pdf' }} />);
    expect(screen.getByRole('heading').textContent).toBe('Not an HTML page');
    const type = screen.getByText('application/pdf');
    expect(type.tagName).toBe('CODE');
    expect(type.parentElement?.textContent).toBe(
      'seocat measures HTML documents. This one is application/pdf.',
    );
  });

  it('failed: сирий message', () => {
    render(<StateScreen outcome={{ kind: 'failed', message: 'boom' }} />);
    expect(screen.getByRole('heading').textContent).toBe("Couldn't measure this page");
    const msg = screen.getByText('boom');
    expect(msg.tagName).toBe('SPAN');
  });
});
