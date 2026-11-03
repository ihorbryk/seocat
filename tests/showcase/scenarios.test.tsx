import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { scenarios } from '../../dev/showcase/scenarios';
import { Popup } from '../../src/popup/Popup';

describe('сценарії showcase', () => {
  it('кожен вид Outcome має хоча б один сценарій', () => {
    const kinds = new Set(scenarios.map((s) => s.outcome.kind));
    expect([...kinds].sort()).toEqual(['failed', 'not-html', 'ok', 'unreadable']);
  });

  it.each(scenarios.filter((s) => s.outcome.kind === 'ok'))(
    '$id: Popup малює таблицю Group',
    ({ url, outcome }) => {
      render(<Popup url={url} outcome={outcome} />);
      expect(screen.getByRole('table')).toBeTruthy();
    },
  );

  it.each(scenarios.filter((s) => s.outcome.kind !== 'ok'))(
    '$id: Popup малює екран стану',
    ({ url, outcome }) => {
      render(<Popup url={url} outcome={outcome} />);
      expect(screen.getByRole('heading')).toBeTruthy();
    },
  );
});
