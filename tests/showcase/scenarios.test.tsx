import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { scenarios } from '../../dev/showcase/scenarios';
import { popupGroups } from '../../src/groups/popup-registry';
import { Popup } from '../../src/popup/Popup';

describe('сценарії showcase', () => {
  it('кожен вид Outcome має хоча б один сценарій', () => {
    const kinds = new Set(scenarios.map((s) => s.outcome.kind));
    expect([...kinds].sort()).toEqual(['failed', 'not-html', 'ok', 'unreadable']);
  });

  const okScenarios = scenarios.filter((s) => s.outcome.kind === 'ok');
  it.each(okScenarios.flatMap((s) => popupGroups.map((g) => ({ ...s, tab: g.id }))))(
    '$id, вкладка $tab: Popup малює панель Group',
    ({ url, outcome, tab }) => {
      render(<Popup url={url} outcome={outcome} initialTab={tab} />);
      expect(screen.getByRole('tab', { selected: true }).id).toBe(`tab-${tab}`);
      expect(screen.getByRole('tabpanel').childElementCount).toBeGreaterThan(0);
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
