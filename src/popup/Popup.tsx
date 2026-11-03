import { groups } from '../groups/registry';
import type { Outcome } from '../shared/envelope';
import { StateScreen } from './StateScreen';

/**
 * Вміст попапа за готовим `Outcome`, без `browser.*`: таблиця Group для `ok`, інакше екран стану.
 * Його рендерять і шел `App`, і showcase (`dev/showcase/`).
 */
export function Popup({ url, outcome }: { url?: string; outcome: Outcome }) {
  if (outcome.kind !== 'ok') return <StateScreen url={url} outcome={outcome} />;

  const group = groups[0]!;
  const View = group.View;
  return <View view={group.assess(outcome.groups[group.id])} />;
}
