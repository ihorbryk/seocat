import { render } from 'preact';
import { Popup } from '../../src/popup/Popup';
import '../../src/popup/popup.css';
import { scenarios } from './scenarios';

/**
 * Showcase: `?scenario=<id>` малює рівно один попап через `Popup`, без параметра — список сценаріїв.
 * Тема — через емуляцію prefers-color-scheme (DevTools), як у Safari.
 */
function Showcase() {
  const id = new URLSearchParams(location.search).get('scenario');
  if (id === null) return <Index />;
  const scenario = scenarios.find((s) => s.id === id);
  if (!scenario) return <Index unknown={id} />;
  document.title = `seocat · ${scenario.id}`;
  return <Popup url={scenario.url} outcome={scenario.outcome} />;
}

function Index({ unknown }: { unknown?: string }) {
  return (
    <div class="px-3.5 py-4">
      <h1 class="text-base font-semibold text-ink">seocat showcase</h1>
      {unknown !== undefined && (
        <p class="mt-1 text-sm text-warn">
          Unknown scenario <code class="font-mono">{unknown}</code>.
        </p>
      )}
      <ul class="mt-2 space-y-1">
        {scenarios.map((s) => (
          <li key={s.id}>
            <a class="text-accent" href={`?scenario=${s.id}`}>
              {s.id}
            </a>{' '}
            <span class="text-muted">· {s.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

render(<Showcase />, document.getElementById('app')!);
