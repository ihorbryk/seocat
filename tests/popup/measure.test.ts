import { describe, expect, it, vi } from 'vitest';
import type { Envelope } from '../../src/extract/envelope';
import { measure, type FrameResult, type TabPort } from '../../src/popup/measure';
import { okOutcome } from '../snapshot';

const URL = 'https://example.com/a';
const okEnvelope: Envelope = okOutcome();

/** Фейк `TabPort`: активна вкладка з id 7 і задані записи кадрів. */
function port(results: readonly FrameResult[], over: Partial<TabPort> = {}): TabPort {
  return {
    activeTab: async () => ({ id: 7, url: URL }),
    executeScript: async () => results,
    ...over,
  };
}

describe('measure: конверт extract.js', () => {
  it.each<[string, Envelope]>([
    ['ok', okEnvelope],
    ['not-html', { kind: 'not-html', contentType: 'application/pdf' }],
    ['failed', { kind: 'failed', message: 'boom' }],
  ])('%s проходить без змін разом з URL вкладки', async (_, envelope) => {
    expect(await measure(port([{ frameId: 0, result: envelope }]))).toEqual({
      url: URL,
      outcome: envelope,
    });
  });

  it('інжектує у вкладку з її id', async () => {
    const executeScript = vi.fn(async () => [{ frameId: 0, result: okEnvelope }]);
    await measure(port([], { executeScript }));
    expect(executeScript).toHaveBeenCalledWith(7);
  });
});

describe('measure: unreadable', () => {
  it.each<[string, readonly FrameResult[]]>([
    ['запис кадру з error і result: null', [{ frameId: 0, error: { message: 'x' }, result: null }]],
    ['порожній масив результатів', []],
    ['запис кадру без result', [{ frameId: 0 }]],
    ['result не схожий на конверт', [{ frameId: 0, result: { foo: 1 } }]],
  ])('%s', async (_, results) => {
    expect(await measure(port(results))).toEqual({ url: URL, outcome: { kind: 'unreadable' } });
  });

  it('виняток executeScript: URL вкладки лишається', async () => {
    const executeScript = () => Promise.reject(new Error('Cannot access this page'));
    expect(await measure(port([], { executeScript }))).toEqual({
      url: URL,
      outcome: { kind: 'unreadable' },
    });
  });

  it('виняток activeTab: без URL і без executeScript', async () => {
    const executeScript = vi.fn();
    const result = await measure(
      port([], { activeTab: () => Promise.reject(new Error('nope')), executeScript }),
    );
    expect(result).toEqual({ outcome: { kind: 'unreadable' } });
    expect(executeScript).not.toHaveBeenCalled();
  });

  it('вкладки немає', async () => {
    expect(await measure(port([], { activeTab: async () => undefined }))).toEqual({
      outcome: { kind: 'unreadable' },
    });
  });

  it('вкладка без id: URL лишається, executeScript не викликається', async () => {
    const executeScript = vi.fn();
    const result = await measure(
      port([], { activeTab: async () => ({ url: 'favorites://' }), executeScript }),
    );
    expect(result).toEqual({ url: 'favorites://', outcome: { kind: 'unreadable' } });
    expect(executeScript).not.toHaveBeenCalled();
  });
});
