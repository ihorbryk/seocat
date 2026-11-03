import { version } from '../../public/manifest.json';
import { groups } from '../groups/registry';
import type { Outcome } from '../shared/envelope';
import { StateScreen } from './StateScreen';

/**
 * Вміст попапа за готовим `Outcome`, без `browser.*`: першим рядком назва і версія з manifest,
 * далі таблиця Group для `ok`, інакше екран стану. Його рендерять і шел `App`, і showcase (`dev/showcase/`).
 */
export function Popup({ url, outcome }: { url?: string; outcome: Outcome }) {
  return (
    <div>
      <div class="bg-surface-2 px-3.5 pt-2 pb-1 text-xs text-muted">seocat {version}</div>
      <OutcomeScreen url={url} outcome={outcome} />
    </div>
  );
}

function OutcomeScreen({ url, outcome }: { url?: string; outcome: Outcome }) {
  if (outcome.kind !== 'ok') return <StateScreen url={url} outcome={outcome} />;

  const group = groups[0]!;
  const View = group.View;
  return <View view={group.assess(outcome.groups[group.id])} />;
}
