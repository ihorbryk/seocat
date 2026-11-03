# Definition of every Metric

Map: [seocat v1](../map.md)
Type: grilling
Status: resolved
Assignee: Ihor Bryk
Blocked by: —

## Question

What exactly does each v1 Metric count or show, including its edge cases?

- **Word count**: which text counts (visible only? excluding `script`, `style`, `noscript`, hidden elements, `nav` or `footer`?), and how a word is split, including Cyrillic, numbers and hyphens.
- **Headings h1–h6**: counts per level and/or a total, and whether hidden headings count.
- **Images**: `<img>` only, or also `<picture>`, inline `<svg>`, CSS backgrounds? Do we count images without `alt`?
- **Links**: which elements count (`<a href>` only?), whether they're split into internal and external, how nofollow, anchors (`#`), `mailto:`, `tel:` and `javascript:` are treated, and whether duplicates count.
- **URL**: the current tab address as-is or normalized.
- **Canonical**: zero or several `<link rel="canonical">` tags, relative URLs, and whether it's compared with the URL.
- **hreflang**: the display format (language → URL), `x-default`, and invalid values.
- **Robots**: `meta name="robots"` plus bot-specific variants (`googlebot` and so on), and how several tags are shown.
- **meta title / description**: missing tags, duplicate tags, and whitespace.

## Answer

Resolved by grilling on 2026-11-03. State terms **Missing**, **Empty**, **Duplicate** are defined in `GLOSSARY.md`.

**Shared rules**

- **Source: the whole DOM, visibility ignored.** Every counting Metric works on DOM structure, not rendering (no `innerText`, no `checkVisibility()`). Hidden elements count. This keeps extraction deterministic and unit-testable on HTML fixtures in a layout-less DOM (jsdom).
- **Scope: the top-level document only.** No `<iframe>` content, no shadow roots.

**Per Metric**

- **URL**: `document.URL` of the snapshot, as-is (query and `#hash` kept, no normalization, no decoding).
- **Meta title**: text of the **first** `<title>`, trimmed with internal whitespace runs collapsed (`document.title` semantics). Live value (JS changes are reflected, since this is a snapshot). States: Missing (no `<title>`), Empty (present but blank after trimming), Duplicate (more than one `<title>`: show the first plus the count).
- **Meta description**: `content` of the **first** `<meta name="description">` (`name` case-insensitive), trimmed and whitespace-collapsed. States: Missing (no tag, or tag without `content`), Empty (`content` blank after trimming), Duplicate (show the first plus the count).
- **Canonical**: every `<link>` whose `rel` contains the `canonical` token, in `<head>` or `<body>`, in document order. Show the **absolute** URL (`link.href`). Several tags: show all (Duplicate). None: Missing. A tag with no `href` or a blank `href`: Empty for that tag, **not** resolved (otherwise it would resolve to the Page URL). Not compared with the URL.
- **hreflang**: every `<link rel="alternate" hreflang="…">`, as `hreflang → absolute URL` pairs in document order. `x-default` shown like any other value; codes shown raw, not validated. None: Missing. Blank/missing `href`: Empty for that entry, not resolved.
- **Robots**: every `<meta>` whose `name` (case-insensitive) is one of `robots`, `googlebot`, `googlebot-news`, `bingbot`, each shown as `name: content` in document order, directives not parsed. None: shown as not set (Missing); the implicit `index, follow` default is not displayed. A tag with blank or no `content` is a found tag in the Empty state, not Missing.
- **Word count**: `textContent` of `<body>`, excluding the subtrees of `script`, `style`, `noscript`, `template`, `svg`, `iframe`, `object`. `nav`/`header`/`footer`/`aside` are **included** (the Metric describes the whole Page). Attributes (`alt`, `title`) and `<head>` are not counted. Split with `Intl.Segmenter(undefined, { granularity: 'word' })`, counting segments with `isWordLike`: Cyrillic works, `п'ять`/`п’ять` is one word, a number is one word, a hyphenated word (`веб-сайт`) is **two**.
- **Headings h1–h6**: six separate counts, one per level, no total. Empty and hidden headings count. Heading text is not shown in v1.
- **Image count**: all `<img>` elements. `<picture>` is not counted separately (its `<img>` is). Inline `<svg>`, CSS backgrounds, `<input type="image">`, favicons are not counted. No "without alt" count in v1.
- **Link count**: all `<a>` with an `href` attribute, any scheme (`#`, `mailto:`, `tel:`, `javascript:` included), duplicates counted. `<a>` without `href` and `<area>` are not counted. One total: no internal/external split, no nofollow breakdown in v1.
