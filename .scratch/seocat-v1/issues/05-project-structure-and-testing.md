# Project structure, build and testing approach

Map: [seocat v1](../map.md)
Type: grilling
Status: resolved
Assignee: Ihor Bryk
Blocked by: 01

## Question

How is the TypeScript + Vite project laid out alongside the Xcode wrapper app? Specifically: what entry points the build produces (popup, extraction script), how the build output lands in the Xcode project, where the boundary sits between pure Metric-extraction logic and browser APIs so it can be unit tested on HTML fixtures, and which test runner and DOM environment the tests use.

## Answer

Resolved by grilling on 2026-11-03.

- **Repo layout:** one npm package at the repo root. `src/`, `public/` (`manifest.json`, `icons/`), `tests/`. `dist/` is gitignored. The Xcode wrapper lives in `xcode/` and is committed.
- **Environment and commands via mise (mandatory):** `mise.toml` at the root pins `node = "26"` (major only; npm comes with Node). Every command is a mise task, the single source of commands. `package.json` holds dependencies only, no scripts:
  - `mise run setup` → `npm ci`
  - `mise run build` → `vite build`
  - `mise run dev` → `vite build --watch`
  - `mise run test` → Vitest
  - `mise run check` → `tsc --noEmit` (TypeScript `strict`) plus Prettier check
  - `mise run xcode:init` → run once: `xcrun safari-web-extension-packager dist --project-location xcode --app-name seocat --bundle-identifier com.ihorbryk.seocat --macos-only --no-open --no-prompt`. No `--copy-resources`, so the project references `../dist`.
  - `mise run xcode` → `xcodebuild` of the project in `xcode/`, "Sign to Run Locally".
  - Xcode itself is a manual prerequisite documented in the README (mise can't install it). Prettier, no ESLint. No CI in v1.
- **Build entry points (Vite):** two of them.
  - `popup.html` + `main.tsx`.
  - `extract.js`, built as an **IIFE** whose last statement is an expression that evaluates to the snapshot. The popup injects it with `browser.scripting.executeScript({ target: { tabId }, files: ['extract.js'] })` and reads the result (returned since Safari 17). `func` was rejected: it is serialized via `toString()`, so it can't import anything.
- **Layers (the test boundary):**
  1. `extract(document): PageSnapshot`. Pure DOM reading, returns JSON-serializable raw data: tag values, counts, all canonical/hreflang/robots entries. Runs on the Page.
  2. `assess(snapshot): GroupView`. Pure, no DOM. Derives Missing/Empty/Duplicate, Length rating and display-ready rows. Runs in the popup.
  3. Shell: `App.tsx` calls `browser.tabs.query` + `executeScript`, runs `assess` and renders. No unit tests.
- **Groups in code:** each Group is a module with its own `extract`, `assess`, types and a Preact `View({ view: GroupView })`. `groups/registry.ts` is an array with a single Group, `seo-basics` (a code id, never shown in the UI). The popup renders it with no switcher. There is no generic declarative Metric description: the layout's header and table are too specific for one.
- **UI:** Preact with JSX via `@preact/preset-vite` (`jsxImportSource: "preact"`). No `preact/compat`, no router, no state library.
- **Styles:** Tailwind v4 via `@tailwindcss/vite`, no `tailwind.config.js`. Theme tokens are defined in `@theme` in `src/popup/popup.css`. Semantic tokens such as `--color-good` and `--color-warn` come from the prototype palette, so components never use raw palette classes. Dark theme via the default `dark:` variant (`prefers-color-scheme`).
- **Browser API types:** the global `browser` (Safari's native promise API) typed by `@types/webextension-polyfill` as a devDependency only, with no runtime polyfill.
- **Tests:** Vitest + jsdom. HTML fixtures are separate files in `tests/fixtures/*.html` with expected values in the tests. `Intl.Segmenter` comes from Node 26. Coverage centers on `extract` (fixtures) and `assess` (plain `PageSnapshot` objects), plus a few modest component tests with `@testing-library/preact`: a table row with its badges (Missing/Duplicate, Length rating) and the header. Styles are never asserted; the look is checked by hand in Safari against the prototype.
- **Dev loop:** `mise run dev`, then Safari Developer › "Add Temporary Extension…" on `dist/` for fast iteration. Use `mise run xcode` for a full wrapper build.
- **Tree:**

```
src/
  popup/        index.html, main.tsx, App.tsx, popup.css
  extract/      entry.ts            (IIFE entry, ends with the snapshot expression)
  groups/
    registry.ts
    seo-basics/ extract.ts, assess.ts, View.tsx, types.ts
  shared/       graphemes.ts etc. (Intl.Segmenter helpers)
public/         manifest.json, icons/
tests/
  fixtures/     *.html
  groups/seo-basics/  extract.test.ts, assess.test.ts, View.test.tsx
xcode/          generated wrapper project (committed)
mise.toml, package.json, vite.config.ts, tsconfig.json
```
