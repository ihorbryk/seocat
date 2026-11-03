import { useEffect, useState } from 'preact/hooks';
import { groups } from '../groups/registry';
import type { Outcome } from '../shared/envelope';
import { classify, type Attempt } from './classify';

/** Шел попапа (без юніт-тестів): tabs.query -> executeScript -> classify -> assess -> рендер. */
async function measure(): Promise<{ url?: string; outcome: Outcome }> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  let attempt: Attempt;
  try {
    attempt = {
      results: await browser.scripting.executeScript({
        target: { tabId: tab!.id! },
        files: ['extract.js'],
      }),
    };
  } catch (thrown) {
    attempt = { thrown };
  }
  return { url: tab?.url, outcome: classify(attempt) };
}

export function App() {
  const [state, setState] = useState<{ url?: string; outcome: Outcome } | null>(null);
  useEffect(() => {
    measure().then(setState);
  }, []);

  // Поки немає результату, нічого не малюємо (без спінера).
  if (!state) return null;
  const { outcome } = state;
  // Екрани стану (unreadable / not-html / failed) додає тікет #6.
  if (outcome.kind !== 'ok') return null;

  const group = groups[0]!;
  const View = group.View;
  return <View view={group.assess(outcome.groups[group.id])} />;
}
