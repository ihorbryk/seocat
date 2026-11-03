import type { Outcome } from '../extract/envelope';

type StateOutcome = Exclude<Outcome, { kind: 'ok' }>;

/** Екран стану замість вкладок: заголовок і один рядок пояснення (URL малює каркас `Popup`). */
export function StateScreen({ outcome }: { outcome: StateOutcome }) {
  return (
    <div class="px-3.5 py-4">
      <h1 class="text-base font-semibold text-ink">{title(outcome)}</h1>
      <p class="mt-1 text-sm text-muted">{body(outcome)}</p>
    </div>
  );
}

function title(outcome: StateOutcome): string {
  switch (outcome.kind) {
    case 'unreadable':
      return "Can't read this page";
    case 'not-html':
      return 'Not an HTML page';
    case 'failed':
      return "Couldn't measure this page";
  }
}

function body(outcome: StateOutcome) {
  switch (outcome.kind) {
    case 'unreadable':
      return "Safari doesn't let extensions access this page.";
    case 'not-html':
      return (
        <>
          seocat measures HTML documents. This one is{' '}
          <code class="font-mono">{outcome.contentType}</code>.
        </>
      );
    case 'failed':
      return (
        <span class="block font-mono text-xs wrap-anywhere text-muted">{outcome.message}</span>
      );
  }
}
