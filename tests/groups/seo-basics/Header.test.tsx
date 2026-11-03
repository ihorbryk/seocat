import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { View } from '../../../src/groups/seo-basics/View';
import { assess } from '../../../src/groups/seo-basics/assess';

describe('View seo-basics', () => {
  it('показує повний URL без нормалізації і рядок Title', () => {
    const url = 'https://example.com/a?b=1&c=2#frag';
    render(
      <View
        view={assess({
          url,
          title: { count: 1, value: 'Hello' },
          canonical: [],
          robots: [],
          hreflang: [],
          description: { count: 0, value: null },
        })}
      />,
    );
    expect(screen.getByTestId('url').textContent).toBe(url);
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Hello')).toBeTruthy();
  });
});
