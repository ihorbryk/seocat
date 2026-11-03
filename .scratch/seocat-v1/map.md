# seocat v1

Label: wayfinder:map

## Destination

An implementation-ready spec for seocat v1: a Safari Web Extension for macOS that shows one Group of Metrics about the current Page. Someone can build it from the spec in a separate session without making further decisions.

## Notes

- Domain language lives in `GLOSSARY.md` (Page, Metric, Group). Sessions should call the `grilling` and `domain-modeling` skills for grilling tickets.
- Tracker: local markdown (`.scratch/seocat-v1/`). Planning only: tickets produce decisions, not code.
- Settled while charting (2026-11-03), standing constraints for every ticket:
  - Platform: Safari on macOS only. Distribution: local Xcode build, not the App Store.
  - Extension type: Safari Web Extension (WebExtension API plus the Xcode wrapper app).
  - Stack: TypeScript, Vite, unit tests.
  - UI surface: a toolbar popup by default. Its layout is settled by a prototype ticket.
  - Data is collected from a snapshot of the live DOM when the popup opens. It is not collected at page load and not tracked live.
  - Sources: HTML only. robots, canonical and hreflang come from markup, not from HTTP headers.
  - The UI is English only. v1 only displays data, with no actions on it.
  - The architecture models Groups because later versions will add more. v1 shows a single Group with no switcher.
- Handoff: when the map is clear, run `/to-spec` in a fresh session that first reads this map and every closed ticket. It decides which decisions become ADRs. Spec text must not rely on file paths; links into `.scratch/` must resolve, so keep it committed.
- The fixed Metric list for v1: URL, meta title (with a length marker), meta description (with a length marker), canonical URL, hreflang tags, robots tags, total word count, h1–h6 heading counts, image count, link count.

## Decisions so far

<!-- one line per closed ticket: [title](issues/NN-slug.md): gist -->
- [Safari Web Extension constraints for seocat](issues/01-safari-web-extension-constraints.md): MV3 with `activeTab` + `scripting`, popup runs `scripting.executeScript` for the DOM snapshot, Xcode wrapper via `safari-web-extension-packager` on the Vite `dist/` with "Sign to Run Locally" and "Allow unsigned extensions" (resets each Safari quit).
- [Definition of every Metric](issues/02-metric-definitions.md): whole DOM with visibility ignored, top-level document only; title/description take the first tag (trimmed, collapsed) with Missing/Empty/Duplicate states; canonical/hreflang absolute URLs, all tags shown; robots from `robots`/`googlebot`/`googlebot-news`/`bingbot`; words via `Intl.Segmenter` on filtered `body` text; `<img>` and `<a href>` single totals; h1–h6 per level.
- [Length markers for meta title and meta description](issues/03-length-markers.md): length in grapheme clusters of the displayed value; Length rating Short/Good/Long with Good = title 30–60, description 70–160 (hard-coded); shown as `57 chars · Good`, green for Good, amber for Short/Long/Missing/Empty; no rating for Missing/Empty, Duplicate rates the first value.
- [Popup layout for the single Group](issues/04-popup-layout.md): fixed 460px wide, up to 600px tall, then everything scrolls. A non-sticky header holds the full URL, tiles for words/images/links and an H1–H6 bar chart. A two-column table below covers only Meta (Title, Description) and Indexing (Canonical, Robots, hreflang), with badges under the Metric name and every value shown in full.
- [Project structure, build and testing approach](issues/05-project-structure-and-testing.md): one root npm package with Node 26 pinned and every command as a task in `mise.toml`. Vite builds a Preact + Tailwind v4 popup plus an IIFE `extract.js` that the popup injects with `executeScript({ files })`. Pure `extract(document) → PageSnapshot` and `assess → GroupView` layers per Group (`seo-basics` in a one-entry registry). Vitest + jsdom on HTML fixtures, plus a few component tests. The packager-generated Xcode project is committed in `xcode/` and references `../dist`.
- [Verify page access on a real local build](issues/06-verify-activetab-on-real-build.md): opening the popup grants `activeTab` with no prompt (but `permissions.contains` still says `false`); on internal pages (`favorites://`) `executeScript` resolves with a per-frame `error` rather than throwing; a PDF runs and reports `contentType: application/pdf` with no body; `file:` and `.txt`/`.json` not checked.
- [Unsupported and empty states](issues/07-unsupported-and-empty-states.md): always try `executeScript`, never pre-filter by URL; outcomes `ok` / `unreadable` (throw, per-frame `error`, no result) / `not-html` (`contentType` not `text/html`/XHTML, checked in the `extract.js` entry) / `failed` (entry's `try/catch`), held in an envelope plus a pure `classify` above the Group layer; non-ok states replace header and table with URL, title and one line of copy; no empty-page or loading state, no spinner.
- [Toolbar icon and minimum visual identity](issues/08-toolbar-icon.md): two 1024px SVGs in `assets/icons/` (a `#F28C28` cat-head glyph for the toolbar, the white glyph on a `#F28C28` rounded square for the rest), color rather than template; `mise run icons` with `@resvg/resvg-js` exports committed PNGs for `default_icon` 16–38, `icons` 48–512 and the 10-file macOS `AppIcon`; name `seocat`, no logo in the popup.

## Not yet specified

<!-- nothing left in the fog: the remaining work is ticketed -->

## Out of scope

- [Structure and location of the v1 spec](issues/09-assemble-the-spec.md): assembling the spec is the `/to-spec` handoff, not a decision on the map.
- iOS and iPadOS support.
- Publishing to the Mac App Store, Developer ID signing, notarization.
- More Groups (Open Graph, schema, performance and so on). The architecture allows for them, but v1 doesn't build them.
- Reading robots, canonical and hreflang from HTTP headers (`X-Robots-Tag`, `Link:`).
- Actions on data: copying, navigating, exporting.
- Localization.
- Tracking DOM changes live.
- Metric breakdowns beyond the fixed list: internal/external and nofollow link split, images without `alt`, heading text, robots directive parsing (ruled out in [Definition of every Metric](issues/02-metric-definitions.md); each would be a new Metric).
- Content inside `<iframe>`s and shadow DOM (same ticket: only the top-level document is measured).
