# Length markers for meta title and meta description

Map: [seocat v1](../map.md)
Type: grilling
Status: resolved
Assignee: Ihor Bryk
Blocked by: —

## Question

How do we compute and show the length marker for meta title and meta description? The unit (characters, and how emoji and Cyrillic count), the "too short / fine / too long" thresholds for each field, and whether we show a color rating, and if so which states it has, including a missing field.

## Answer

Resolved by grilling on 2026-11-03. The term **Length rating** (Short / Good / Long) is defined in `GLOSSARY.md`.

- **Unit: grapheme clusters.** Length = number of segments from `Intl.Segmenter(undefined, { granularity: 'grapheme' })` over the **displayed** value (trimmed, whitespace runs collapsed, as defined in [Definition of every Metric](02-metric-definitions.md)). An emoji such as 👍🏽 is 1, each Cyrillic letter is 1, `é` is 1 whether precomposed or not. Not `string.length`, not pixel width.
- **Thresholds (inclusive), hard-coded constants, not configurable in v1:**
  - Meta title: Short < 30, **Good 30–60**, Long > 60.
  - Meta description: Short < 70, **Good 70–160**, Long > 160.
- **Display:** the character count plus a text label for the Length rating, e.g. `57 chars · Good`. The label carries the meaning and color only reinforces it. Two color levels: green for Good, amber for Short and Long, since both are warnings, not errors. Placement and styling are left to [Popup layout for the single Group](04-popup-layout.md).
- **Interaction with Metric states:**
  - **Missing**: no length or Length rating, only the Missing state.
  - **Empty**: no length or Length rating (never `0 chars · Short`), only the Empty state.
  - **Duplicate**: length and Length rating are computed for the **first** value (the one displayed), shown alongside the Duplicate state and its count.
  - Missing and Empty use the same amber warning color as Short/Long.
