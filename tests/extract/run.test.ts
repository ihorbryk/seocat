import { JSDOM } from 'jsdom';
import { describe, expect, it, vi } from 'vitest';
import { run } from '../../src/extract/run';
import { loadFixture } from '../helpers';

describe('extract run', () => {
  it('HTML-сторінка: конверт ok зі знімками Content і Indexing', () => {
    const envelope = run(loadFixture('canonical-relative'));
    expect(envelope).toEqual({
      kind: 'ok',
      groups: {
        content: expect.objectContaining({ title: expect.any(Object) }),
        indexing: expect.objectContaining({ canonical: ['https://example.com/page?x=1'] }),
      },
    });
  });

  it('конверт переживає JSON-серіалізацію (як у executeScript)', () => {
    const envelope = run(loadFixture('title-duplicate'));
    expect(JSON.parse(JSON.stringify(envelope))).toEqual(envelope);
  });

  it('не-HTML contentType: not-html без запуску Groups', () => {
    const extractGroup = vi.fn();
    // jsdom не вміє створювати не-HTML документи, тому підміняємо contentType.
    const doc = loadFixture('title-normal');
    Object.defineProperty(doc, 'contentType', { value: 'application/json' });
    const envelope = run(doc, [{ id: 'content', extract: extractGroup }]);
    expect(envelope).toEqual({ kind: 'not-html', contentType: 'application/json' });
    expect(extractGroup).not.toHaveBeenCalled();
  });

  it('application/xhtml+xml вважається HTML', () => {
    const doc = new JSDOM('<html xmlns="http://www.w3.org/1999/xhtml"><head/><body/></html>', {
      contentType: 'application/xhtml+xml',
    }).window.document;
    expect(run(doc).kind).toBe('ok');
  });

  it('виняток Group: конверт failed з текстом помилки', () => {
    const doc = loadFixture('title-normal');
    const envelope = run(doc, [
      {
        id: 'content',
        extract: () => {
          throw new Error('boom');
        },
      },
    ]);
    expect(envelope).toEqual({ kind: 'failed', message: 'boom' });
  });
});
