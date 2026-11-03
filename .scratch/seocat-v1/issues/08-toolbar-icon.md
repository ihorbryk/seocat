# Toolbar icon and minimum visual identity

Map: [seocat v1](../map.md)
Type: grilling
Status: resolved
Assignee: Ihor Bryk
Blocked by: —

## Question

What icon and branding does the v1 local build ship with? Without `icons` in `manifest.json` the packager warns "manifest.json is missing icons" and adds none, but the project still builds ([Verify page access on a real local build](06-verify-activetab-on-real-build.md)).

- Do we ship icons in v1 at all, or accept the warning and Safari's default?
- If yes: which assets are needed (the `icons` and `action.default_icon` sizes in `manifest.json`, the toolbar icon as a template/monochrome image or in color, the wrapper app's `AppIcon` in `xcode/`), and how they are produced (one hand-drawn SVG exported to PNGs, a script, or a placeholder).
- Where the source lives (`public/icons/` per [Project structure, build and testing approach](05-project-structure-and-testing.md)) and whether the popup shows the name or a logo anywhere (the settled layout has none).

## Answer

Resolved by grilling on 2026-11-03. No new glossary terms; no ADR (cheap to change).

- **v1 ships icons.** The packager's "manifest.json is missing icons" warning goes away.
- **Two SVG sources in `assets/icons/`** (outside `public/`, so they never reach `dist/`), both on a 1024×1024 canvas:
  - `toolbar.svg`: the bare glyph, solid `#F28C28`.
  - `app.svg`: the same glyph in white on a `#F28C28` rounded square, 824×824 at offset 100, corner radius 185, no shadow (macOS icon grid).
- **Motif:** a filled silhouette of a cat's head with two pointed ears. Originally no face at all; revised on 2026-11-04 to add one, cut out of the head (negative space, so the palette stays two colours and the toolbar icon stays single-colour on light and dark toolbars):
  - `app.svg`: vertical oval eyes, a rounded downward triangle nose and an "ω" mouth.
  - `toolbar.svg`: simplified for 16px — larger eyes and nose, no mouth (a mouth at 16px is a 1px smear).
  - Still no whiskers: thin lines vanish at small sizes.
- **Toolbar icon is in color, not a template image.** A color image renders predictably on light and dark toolbars whatever Safari does with monochrome icons, so template rendering was deliberately not verified (research found no primary source on Safari's tinting; Safari needs PNG, not SVG, for `default_icon`).
- **Sizes:**
  - `action.default_icon`: 16, 19, 32, 38 px, from `toolbar.svg`.
  - `icons`: 48, 64, 96, 128, 256, 512 px, from `app.svg`.
  - `AppIcon.appiconset` in `xcode/`: the classic 10 macOS files (16, 32, 128, 256, 512 pt at @1x and @2x, up to 1024px) from `app.svg`, plus a `Contents.json` the script writes. This does not rely on whatever the packager does with manifest icons, nor on Xcode's single-size option.
- **Generation:** `@resvg/resvg-js` as a devDependency, run by a `mise run icons` task. Run by hand when an SVG changes, not on every build. The generated PNGs are committed in `public/icons/` and in the `AppIcon.appiconset`.
- **Names:** manifest `name: "seocat"`, `description: "Shows SEO facts about the current page."`. The wrapper app is also named "seocat" and keeps the packager-generated window ("turn on the extension in Safari Settings"), uncustomised.
- **Popup:** no name or logo, as the settled layout has it.
