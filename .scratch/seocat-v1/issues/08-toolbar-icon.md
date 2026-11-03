# Toolbar icon and minimum visual identity

Map: [seocat v1](../map.md)
Type: grilling
Status: open
Blocked by: —

## Question

What icon and branding does the v1 local build ship with? Without `icons` in `manifest.json` the packager warns "manifest.json is missing icons" and adds none, but the project still builds ([Verify page access on a real local build](06-verify-activetab-on-real-build.md)).

- Do we ship icons in v1 at all, or accept the warning and Safari's default?
- If yes: which assets are needed (the `icons` and `action.default_icon` sizes in `manifest.json`, the toolbar icon as a template/monochrome image or in color, the wrapper app's `AppIcon` in `xcode/`), and how they are produced (one hand-drawn SVG exported to PNGs, a script, or a placeholder).
- Where the source lives (`public/icons/` per [Project structure, build and testing approach](05-project-structure-and-testing.md)) and whether the popup shows the name or a logo anywhere (the settled layout has none).
