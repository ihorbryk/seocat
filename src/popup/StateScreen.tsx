import type { Outcome } from '../shared/envelope';
import { UrlBlock } from '../ui/UrlBlock';

type StateOutcome = Exclude<Outcome, { kind: 'ok' }>;

/** Екран стану замість хедера і таблиці: URL (якщо відомий), заголовок, один рядок пояснення. */
export function StateScreen({ url, outcome }: { url?: string; outcome: StateOutcome }) {
  return (
    <div>
      {url && (
        <div class="bg-surface-2 px-3.5 py-3">
          <UrlBlock url={url} />
        </div>
      )}
      <div class="px-3.5 py-4">
        <h1 class="text-base font-semibold text-ink">{title(outcome)}</h1>
        <p class="mt-1 text-sm text-muted">{body(outcome)}</p>
      </div>
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
