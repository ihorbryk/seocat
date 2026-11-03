import { useEffect, useState } from 'preact/hooks';
import { browserPort } from './browser-port';
import { readLastTab, writeLastTab } from './last-tab';
import { measure, type Measurement } from './measure';
import { Popup } from './Popup';

/** Шел попапа: `measure(browserPort)`, далі рендер через `Popup` з пам'яттю останньої вкладки. */
export function App() {
  const [state, setState] = useState<Measurement | null>(null);
  useEffect(() => {
    measure(browserPort).then(setState);
  }, []);

  // Поки немає результату, нічого не малюємо (без спінера).
  if (!state) return null;
  return (
    <Popup
      url={state.url}
      outcome={state.outcome}
      initialTab={readLastTab(storage())}
      onTabChange={(id) => writeLastTab(storage(), id)}
    />
  );
}

/** `localStorage` попапа; сам доступ до нього може кинути виняток (заблоковані дані сайту). */
function storage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}
