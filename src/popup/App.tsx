import { useEffect, useState } from 'preact/hooks';
import { groups } from '../groups/registry';
import type { Outcome } from '../shared/envelope';
import { classify, type Attempt } from './classify';
import { StateScreen } from './StateScreen';

/** Шел попапа (без юніт-тестів): tabs.query -> executeScript -> classify -> assess -> рендер. */
async function measure(): Promise<{ url?: string; outcome: Outcome }> {
  let tab: Awaited<ReturnType<typeof browser.tabs.query>>[number] | undefined;
  try {
    [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  } catch {
    return { outcome: { kind: 'unreadable' } };
  }
  if (tab?.id === undefined) return { url: tab?.url, outcome: { kind: 'unreadable' } };

  let attempt: Attempt;
  try {
    attempt = {
      results: await browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['extract.js'],
      }),
    };
  } catch (thrown) {
    attempt = { thrown };
  }
  return { url: tab.url, outcome: classify(attempt) };
}

export function App() {
  const [state, setState] = useState<{ url?: string; outcome: Outcome } | null>(null);
  useEffect(() => {
    measure().then(setState);
  }, []);

  // Поки немає результату, нічого не малюємо (без спінера).
  if (!state) return null;
  const { outcome, url } = state;
  if (outcome.kind !== 'ok') return <StateScreen url={url} outcome={outcome} />;

  const group = groups[0]!;
  const View = group.View;
  return <View view={group.assess(outcome.groups[group.id])} />;
}
