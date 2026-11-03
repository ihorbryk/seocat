import { useState } from 'preact/hooks';
import { version } from '../../public/manifest.json';
import type { Outcome } from '../extract/envelope';
import type { GroupId, GroupSnapshots } from '../groups/page-registry';
import { GroupPanel, popupGroups, toGroupId } from '../groups/popup-registry';
import { Tabs } from '../ui/Tabs';
import { UrlBlock } from '../ui/UrlBlock';
import { StateScreen } from './StateScreen';

/**
 * Вміст попапа за готовим `Outcome`, без `browser.*`. Каркас: назва і версія з manifest,
 * URL вкладки (якщо відомий), далі вкладки Groups для `ok` або екран стану.
 * Його рендерять і шел `App`, і showcase (`dev/showcase/`).
 */
export function Popup({
  url,
  outcome,
  initialTab,
  onTabChange,
}: {
  url?: string;
  outcome: Outcome;
  /** id Group; невідомий або відсутній дає першу Group реєстру. */
  initialTab?: string;
  onTabChange?: (id: GroupId) => void;
}) {
  return (
    <div>
      <div class="bg-surface-2 px-3.5 pt-2 pb-1 text-xs text-muted">seocat {version}</div>
      {url && (
        <div class="bg-surface-2 px-3.5 pb-2">
          <UrlBlock url={url} />
        </div>
      )}
      {outcome.kind === 'ok' ? (
        <GroupTabs snapshots={outcome.groups} initialTab={initialTab} onTabChange={onTabChange} />
      ) : (
        <StateScreen outcome={outcome} />
      )}
    </div>
  );
}

function GroupTabs({
  snapshots,
  initialTab,
  onTabChange,
}: {
  snapshots: GroupSnapshots;
  initialTab?: string;
  onTabChange?: (id: GroupId) => void;
}) {
  const [active, setActive] = useState<GroupId>(() => toGroupId(initialTab));
  const select = (id: GroupId) => {
    setActive(id);
    onTabChange?.(id);
  };
  return (
    <Tabs items={popupGroups} active={active} onSelect={select}>
      <GroupPanel id={active} snapshots={snapshots} />
    </Tabs>
  );
}
