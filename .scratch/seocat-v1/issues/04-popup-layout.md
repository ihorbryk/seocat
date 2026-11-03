# Popup layout for the single Group

Map: [seocat v1](../map.md)
Type: prototype
Status: resolved
Assignee: Ihor Bryk
Blocked by: —
Prototype: [popup-layout-PROTOTYPE.html](../prototypes/popup-layout-PROTOTYPE.html)

## Question

How does the popup look and behave when it shows the single v1 Group: the order and grouping of Metrics, how long values (URL, canonical, the hreflang list, robots) and multiple values are shown, how the length markers look, the popup's width and height, and light and dark themes? The prototype is a rough HTML page for the user to react to.

## Answer

Resolved by prototype on 2026-11-03. The user compared three variants (A sectioned list, B summary first with expandable rows, C dense table) and picked a combination: the **header from B with the table from C**, recorded as variant D in the prototype.

- **Width: fixed 460px.** Height grows with content up to 600px, then the whole popup scrolls. The header is **not** sticky: it scrolls away with the rest.
- **Header (from B):** the Page URL first, in full and wrapped (monospace, secondary color, no label, no truncation). Below it, three large number tiles: **words**, **images**, **links** (thousands separators, `1,488`). Below those, a small bar chart of **H1–H6**: six columns, each with its count above the bar and the level below. A zero shows as a flat gray stub, not hidden.
- **Table (from C), only for Metrics with text values,** in two sections with small uppercase separator rows:
  - **Meta:** Title, Description.
  - **Indexing:** Canonical, Robots, hreflang.
  - The numeric Metrics are **not** repeated in the table: the header is their only place. The URL is not a table row either.
- **Row anatomy:** the left column (about 128px) holds the Metric name and, **under the name**, its badges. The right column holds the value(s) in monospace, wrapped in full (`overflow-wrap: anywhere`).
  - Badges: Missing / Empty / Duplicate ×N (amber), the length marker `57 chars · Good` (green for Good, amber otherwise), as decided in [Length markers for meta title and meta description](03-length-markers.md).
  - Lists (Canonical, Robots, hreflang): the name column shows the tag count, or Missing when there are none, or Duplicate ×N for more than one canonical. Every entry is its own line in the value column, **always shown in full**, no collapsing or "show more". Entry formats: canonical `URL`, robots `name: content`, hreflang `code → URL`. An Empty entry shows an amber Empty badge in place of its value.
- **Themes:** light and dark from `prefers-color-scheme` (`color-scheme: light dark`). The prototype's palette is a starting point, not a spec.
- Rejected: one-line truncated rows with expand (B's body), and labels above values (A).

Prototype (primary source): `.scratch/seocat-v1/prototypes/popup-layout-PROTOTYPE.html`, open with `?variant=D`. Also committed to the throwaway local branch `prototype/popup-layout`, which is never merged.
