import { fireEvent, render, screen, within } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { View } from '../../../src/groups/images/View';
import { assess } from '../../../src/groups/images/assess';
import type { ImageEntry } from '../../../src/groups/images/types';
import { imageEntry, imagesSnapshot } from '../../snapshot';

const renderImages = (...images: Partial<ImageEntry>[]) =>
  render(<View view={assess(imagesSnapshot({ images: images.map(imageEntry) }))} />);

describe('View Images', () => {
  it('плитки хедера: Total, Missing alt, Empty alt, > 1 MB', () => {
    renderImages({ alt: null }, { alt: '' }, { bytes: 3_000_000 });
    expect(screen.getByTestId('tile-total').textContent).toBe('3images');
    expect(screen.getByTestId('tile-missing-alt').textContent).toBe('1missing alt');
    expect(screen.getByTestId('tile-empty-alt').textContent).toBe('1empty alt');
    expect(screen.getByTestId('tile-heavy').textContent).toBe('1> 1 MB');
  });

  it('рядок Image: alt, посилання в новій вкладці, розміри і вага', () => {
    renderImages({
      src: 'https://example.com/hero.jpg',
      alt: 'Hero banner',
      natural: { width: 1600, height: 900 },
      bytes: 250_880,
    });
    const row = within(screen.getByTestId('image-0'));
    expect(row.getByText('Hero banner')).toBeTruthy();
    const link = row.getByRole('link', { name: 'https://example.com/hero.jpg' });
    expect(link.getAttribute('href')).toBe('https://example.com/hero.jpg');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(row.getByTestId('file').textContent).toBe('1600×900 · 245 KB');
  });

  it('важкий файл позначено для підсвічування', () => {
    renderImages({ bytes: 1_048_577 });
    expect(screen.getByTestId('size').getAttribute('data-heavy')).toBe('true');
  });

  it('без alt і адреси: бейджі Missing, без посилання і прев’ю', () => {
    renderImages({ src: '', alt: null, natural: null, bytes: null });
    const row = within(screen.getByTestId('image-0'));
    expect(row.getAllByText('Missing')).toHaveLength(2);
    expect(row.queryByRole('link')).toBeNull();
    expect(row.getByText('Not loaded')).toBeTruthy();
    expect(row.getByTestId('preview-placeholder')).toBeTruthy();
  });

  it('data: URI: скорочений текст без посилання', () => {
    renderImages({ src: 'data:image/png;base64,aGVsbG8=' });
    const row = within(screen.getByTestId('image-0'));
    expect(row.getByText('data:image/png;base64,…')).toBeTruthy();
    expect(row.queryByRole('link')).toBeNull();
  });

  it('вага невідома: розміри і Size unknown', () => {
    renderImages({ bytes: null });
    expect(screen.getByTestId('file').textContent).toBe('100×50 · Size unknown');
  });

  it('прев’ю не завантажилось: плейсхолдер', () => {
    renderImages({ src: 'https://example.com/hotlink.png' });
    const preview = screen.getByTestId('preview');
    expect(preview.getAttribute('src')).toBe('https://example.com/hotlink.png');
    fireEvent.error(preview);
    expect(screen.queryByTestId('preview')).toBeNull();
    expect(screen.getByTestId('preview-placeholder')).toBeTruthy();
  });

  it('Images немає: повідомлення замість списку', () => {
    renderImages();
    expect(screen.getByText('No images on this page')).toBeTruthy();
  });
});
