# Unsupported and empty states

Map: [seocat v1](../map.md)
Type: grilling
Status: resolved
Assignee: Ihor Bryk
Blocked by: 06

## Question

What does the popup show when it can't measure the Page, and how does the code decide which case it is in? Facts from [Verify page access on a real local build](06-verify-activetab-on-real-build.md): opening the popup grants `activeTab` with no prompt; on Safari internal pages `executeScript` resolves with a per-frame `error` instead of throwing; a PDF runs normally and reports `contentType: "application/pdf"` with no body text.

- The set of states (for example: unsupported page, not an HTML document, script failed, still loading), and which signals drive each: a non-http(s) URL, the per-frame `error`, an exception, `document.contentType` other than `text/html`.
- Whether these states are part of `GroupView` / `PageSnapshot` or sit above the Group layer, and how they are tested.
- The copy and placement for each state within the settled popup layout ([Popup layout for the single Group](04-popup-layout.md)).
- How the unchecked cases (`file:` URLs, `.txt`/`.json` documents) are handled without verification: do they fall into the same rules?
- Whether a "page with nothing to measure" state exists (for example, an HTML page with no title and no body text), or whether it just shows zeros and Missing badges.

## Answer

Resolved by grilling on 2026-11-03. The terms **Unreadable** and **Not HTML** are defined in `GLOSSARY.md`.

- **Classify by trying, never by URL.** The popup always calls `executeScript` and decides the state from what comes back. There is no `tab.url` scheme pre-filter. The unchecked cases need no special code: a `file:` URL fails like an internal page (→ Unreadable), and a `.txt`/`.json` document reports its own `contentType` (→ Not HTML).
- **Four outcomes**, with these signals:
  - `ok`: a snapshot came back.
  - `unreadable`: `executeScript` threw, **or** the frame entry has an `error`, **or** there is no result. The error text is never parsed (matching `"Extension does not have access…"` would be fragile).
  - `not-html`: `document.contentType` is neither `text/html` nor `application/xhtml+xml`. The `extract.js` entry checks this first and does not run any Group.
  - `failed`: our own extraction threw. The `extract.js` entry wraps the Group extracts in `try/catch` and returns the message, so our bugs are told apart from Safari's refusal without string matching.
- **Layering: above the Group layer.** `PageSnapshot` and `GroupView` know nothing about these states.
  - The `extract.js` entry returns an envelope: `{ kind: 'ok', groups: { 'seo-basics': PageSnapshot } } | { kind: 'not-html', contentType } | { kind: 'failed', message }`.
  - In the popup, a pure `classify(injectionResult | thrownError) → Outcome` adds `unreadable` and passes the rest through. The `kind` names match the glossary terms.
  - Tests: `classify` on plain objects shaped like the Safari responses recorded in [Verify page access on a real local build](06-verify-activetab-on-real-build.md); the entry's `contentType` check on a jsdom fixture.
- **No "nothing to measure" state.** An HTML page with no title and no text shows the normal popup with zeros and Missing badges.
- **No "still loading" state and no spinner.** The snapshot is taken as-is whatever `document.readyState` is; reopening the popup refreshes it. The popup renders nothing until the result arrives (about 2 ms in the probe).
- **Placement:** for `unreadable`, `not-html` and `failed` the popup keeps its 460px width, and one message block replaces the header and table: the Page URL on top in the header's style (monospace, secondary color, in full; omitted if `tab.url` is absent), then a title and one line of explanation. Height fits the content. No icons, no buttons.
- **Copy (English):**
  - Unreadable: **Can't read this page**. "Safari doesn't let extensions access this page." The raw Safari error is not shown.
  - Not HTML: **Not an HTML page**. "seocat measures HTML documents. This one is `<contentType>`." with the actual type in monospace.
  - Failed: **Couldn't measure this page**, then the raw `message` in small monospace secondary text, for diagnosis.
