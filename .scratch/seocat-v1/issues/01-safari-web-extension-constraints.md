# Safari Web Extension constraints for seocat

Map: [seocat v1](../map.md)
Type: research
Status: resolved
Blocked by: —

## Question

What do Safari on macOS and its Web Extension platform require and allow for seocat v1 (a toolbar popup that reads a DOM snapshot of the active tab)?

- Manifest version (MV2 or MV3) and its support status in current Safari.
- The minimum permissions (`activeTab`, `scripting`, host permissions), and how Safari prompts the user for per-site access.
- How the popup gets data from the Page: `scripting.executeScript` versus a content script plus messaging, and the limits of each in Safari.
- Where the extension cannot run (internal pages, PDFs, other special cases).
- The Xcode wrapper app: how to create it (`xcrun safari-web-extension-converter` or an Xcode template), and how a TypeScript + Vite build feeds its resources.
- How to run an unsigned local build (Develop menu, "Allow Unsigned Extensions").

## Answer

Full findings with sources: [../research/safari-web-extension-constraints.md](../research/safari-web-extension-constraints.md)

- **Manifest version:** Safari supports MV2 and MV3 since Safari 15.4. Use MV3 (`host_permissions`, `action`, `scripting` are all available from 15.4).
- **Permissions:** `["activeTab", "scripting"]`, no host permissions. Safari defaults site access to "ask"; `activeTab` treats the toolbar interaction as the grant, so there is no install-time prompt. On a site without access, Safari badges the toolbar item and the user chooses single use, for a day, all sites, or deny; later changes go in Settings > Websites (Ask/Allow/Deny). activeTab access is tied to the document and ends on navigation to a different URL. Unconfirmed: whether opening a popup counts as the activeTab gesture; verify on a real build.
- **Data retrieval:** the popup calls `tabs.query` then `scripting.executeScript` (Safari 15.4+, results returned from 17) with a self-contained function or bundled file that returns a JSON-serializable snapshot. A content script plus messaging needs prior site access and adds complexity that live tracking would justify, which is out of scope.
- **Where it cannot run:** sites without granted access, `about:blank`/`srcdoc` frames (WebKit bugs), `file:` URLs. Safari internal pages, the PDF viewer and non-HTML documents have no primary documentation: unconfirmed, so treat a missing/non-http(s) URL or an `executeScript` error as "unsupported".
- **Xcode wrapper:** the tool is now `xcrun safari-web-extension-packager <dir>` (renamed from `safari-web-extension-converter`), or the Xcode "Safari Extension App" template. By default the project references the source folder, so point it at Vite's `dist/`. Xcode is not installed on this machine (Command Line Tools only).
- **Running locally:** set both targets to "Sign to Run Locally" (Team None), Product > Run, then Safari > Settings > Developer > "Allow unsigned extensions" (resets on every Safari quit), then enable it in Settings > Extensions. For early iteration without Xcode: Developer tab > "Add Temporary Extension..." (lasts until quit or 24 hours).

**Recommendation:** MV3, `activeTab` + `scripting`, popup-driven `scripting.executeScript` snapshot, packager run once on `dist/` without `--copy-resources`, Vite rebuild + Xcode Product > Build per change, "Sign to Run Locally". Prerequisite: install Xcode.
