import { describe, expect, it } from 'vitest';
import { classify } from '../../src/popup/classify';
import type { Envelope } from '../../src/extract/envelope';
import { okOutcome } from '../snapshot';

const okEnvelope: Envelope = okOutcome();

describe('classify', () => {
  it('ok проходить без змін', () => {
    expect(classify({ results: [{ frameId: 0, result: okEnvelope }] })).toEqual(okEnvelope);
  });

  it('not-html проходить без змін', () => {
    const envelope: Envelope = { kind: 'not-html', contentType: 'application/pdf' };
    expect(classify({ results: [{ frameId: 0, result: envelope }] })).toEqual(envelope);
  });

  it('failed проходить без змін', () => {
    const envelope: Envelope = { kind: 'failed', message: 'boom' };
    expect(classify({ results: [{ frameId: 0, result: envelope }] })).toEqual(envelope);
  });

  it('виняток executeScript -> unreadable', () => {
    expect(classify({ thrown: new Error('Cannot access this page') })).toEqual({
      kind: 'unreadable',
    });
  });

  it('запис кадру з error і result: null -> unreadable', () => {
    expect(classify({ results: [{ frameId: 0, error: { message: 'x' }, result: null }] })).toEqual({
      kind: 'unreadable',
    });
  });

  it('порожній масив результатів -> unreadable', () => {
    expect(classify({ results: [] })).toEqual({ kind: 'unreadable' });
  });

  it('запис кадру без result -> unreadable', () => {
    expect(classify({ results: [{ frameId: 0 }] })).toEqual({ kind: 'unreadable' });
  });

  it('result не схожий на конверт -> unreadable', () => {
    expect(classify({ results: [{ frameId: 0, result: { foo: 1 } }] })).toEqual({
      kind: 'unreadable',
    });
  });
});
