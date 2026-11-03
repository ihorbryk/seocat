# Safari Web Extension constraints for seocat v1

Researched 2026-11-03. Environment checked locally: macOS 27.2, Safari 27.2; only Command Line Tools installed (no Xcode, so `xcodebuild` and the packager are not available yet). Safari-version facts below come from Apple docs and MDN browser-compat-data (BCD); anything unconfirmed is marked **UNCONFIRMED**.

## 1. Manifest version

- Safari supports both MV2 and MV3 since Safari 15.4 ([Apple: assessing browser compatibility](https://developer.apple.com/documentation/safariservices/assessing-your-safari-web-extension-s-browser-compatibility)). Safari web extensions overall exist since Safari 14 ([Apple: Safari web extensions](https://developer.apple.com/documentation/safariservices/safari-web-extensions)).
- MV3 specifics: `host_permissions` and `action` are MV3-only and arrive in Safari 15.4 ([MDN BCD host_permissions](https://github.com/mdn/browser-compat-data/blob/main/webextensions/manifest/host_permissions.json), [action](https://github.com/mdn/browser-compat-data/blob/main/webextensions/manifest/action.json)). With MV3 all background pages are nonpersistent; use a nonpersistent background page or a service worker ([Apple: optimizing](https://developer.apple.com/documentation/safariservices/optimizing-your-web-extension-for-safari)).
- No source found marking MV2 as deprecated in Safari. MV3 is the right choice for a new extension (Chrome-compatible, `scripting.executeScript` is the standard path). Safari also supports `browser.*` and `chrome.*` namespaces, promises and callbacks.
- `browser_specific_settings.safari.strict_min_version` can pin a minimum Safari ([Apple: optimizing](https://developer.apple.com/documentation/safariservices/optimizing-your-web-extension-for-safari)).

## 2. Permissions and the per-site prompt

- `scripting` permission: Safari 15.4+ ([MDN BCD](https://github.com/mdn/browser-compat-data/blob/main/webextensions/manifest/permissions.json)). `activeTab`: Safari 14+.
- `scripting.executeScript` needs `scripting` plus access to the URL via a host permission or `activeTab` ([MDN executeScript](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/executeScript)). Safari 15.4+, `InjectionResult` (return values) from Safari 17 ([BCD scripting](https://github.com/mdn/browser-compat-data/blob/main/webextensions/api/scripting.json)).
- activeTab in Safari ([MDN activeTab](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/activeTab_permission)): Safari defaults host permissions to "ask" and prompts the first time (Allow for One Day / Always Allow); `activeTab` avoids that prompt because the user's interaction is the grant. Access is tied to the document in the tab and is revoked when the tab navigates to a different URL (same-document navigations keep it). activeTab also exposes `tab.url`/`title`, and supports script injection (with `scripting`).
- Apple's description of the user flow ([Apple: managing permissions](https://developer.apple.com/documentation/safariservices/managing-safari-web-extension-permissions)): on a page without granted access Safari shows a badge on the extension's toolbar item; the user clicks the toolbar button and picks single use, for the day, all websites, or deny. Users can later set Ask / Allow / Deny per website in Safari > Settings > Websites (extension section). In Safari 17+ a per-site grant applies across all profiles and private browsing. Apple advises preferring `activeTab`, host permissions and content-script matches, and using `<all_urls>`-style access only if nothing else works.
- Content scripts declared with `matches` are not applied to tabs until the user grants permission via the toolbar access popover ([BCD content_scripts note](https://github.com/mdn/browser-compat-data/blob/main/webextensions/manifest/content_scripts.json)).
- **UNCONFIRMED:** whether merely opening a *popup* (the default_popup) counts as the activeTab user gesture in Safari. MDN lists toolbar-button click, context menu and keyboard shortcut as grants and does not mention popups specifically; Apple's doc says the user clicks the toolbar button and chooses a permission option. Likely outcome: first open on a site shows Safari's access popover instead of the popup content (or the badge), then the popup works after the user allows. This must be verified on a real build (it needs Xcode, which is not installed here).

Minimum permission set: `["activeTab", "scripting"]`, no `host_permissions`.

## 3. Getting data from the page

| Approach | Safari support | Fit |
|---|---|---|
| `scripting.executeScript({target:{tabId}, func})` called from the popup | Safari 15.4+; results returned (`InjectionResult`) 17+; MV2 and MV3 ([BCD](https://github.com/mdn/browser-compat-data/blob/main/webextensions/api/scripting.json)) | Best match for "snapshot when popup opens". `func` is serialized, so it must be self-contained (no closures/imports); `args` and result must be structured-cloneable/JSON ([MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/executeScript)). Use `files` to inject a separate bundled script instead, which suits a Vite build. Runs once, on demand, no persistent injection. |
| Declared content script + `tabs.sendMessage` / `runtime.onMessage` | `tabs.sendMessage`, `runtime.sendMessage` Safari 14+ ([BCD tabs](https://github.com/mdn/browser-compat-data/blob/main/webextensions/api/tabs.json)) | Needs host access at page load (the user must have granted the site first), and the script is not injected in tabs already open before grant. More moving parts; only worth it for live tracking, which is out of scope. |
| `tabs.executeScript` | MV2 only | Avoid. |

Other limits: `injectImmediately` is accepted but scripts always inject immediately (Safari 15.4, [WebKit bug 297903](https://webkit.org/b/297903)). Safari does not inject via `scripting` into `about:blank`/`about:srcdoc` frames ([WebKit bug 296702](https://bugs.webkit.org/show_bug.cgi?id=296702), filed 2025; status not checked). Per MDN, in Safari partial host-permission lack can still resolve with partial results rather than reject, so check each result's `error`/`result` for `undefined`. `scripting.ExecutionWorld`: Safari supports `world` (15.4+). Plain `executeScript` on the active tab with default frames hits only the top frame, which is what seocat wants.

Recommendation: popup calls `tabs.query({active:true, currentWindow:true})`, then `scripting.executeScript` with an injected function/file that returns a plain JSON object (title, meta tags, canonical, hreflang, robots, headings, images, links, word count), then renders in the popup. No background script is needed.

## 4. Where it cannot run

Apple's docs do not list restricted pages. Confirmed or found:

- Pages where the user has not granted access: no data until granted (see section 2). `executeScript` rejects or returns errors.
- `about:blank`/`about:srcdoc` iframes: not injectable ([WebKit bug 296702](https://bugs.webkit.org/show_bug.cgi?id=296702), [263817](https://bugs.webkit.org/show_bug.cgi?id=263817)).
- `file:` URLs: Safari ignores file URL schemes in manifest permissions ([Apple: compatibility](https://developer.apple.com/documentation/safariservices/assessing-your-safari-web-extension-s-browser-compatibility)); a 2020 Apple forum report (seen only in a search snippet, not opened) says content scripts also do not load on file URLs.
- **UNCONFIRMED (no primary source found):** Safari internal pages (Start Page/Favorites, `safari-resource:`, `view-source:`, `about:` pages), the built-in PDF viewer, other extensions' pages, and the Safari extension gallery. Expect these to be inaccessible; treat any failed `tabs.query` url (undefined, non-http(s) scheme) or `executeScript` error as "unsupported". Non-HTML documents (XML, plain text, images, PDF): the injected function runs only if Safari allows it; guard with `document.contentType` and `document.documentElement` checks in the injected code.
- Private windows: extensions must be allowed in private browsing in Safari Settings (not researched in depth; **UNCONFIRMED** detail).

This affects the map item "Unsupported and empty states".

## 5. The Xcode wrapper app

- Tool renamed: it is now **`xcrun safari-web-extension-packager`** (formerly `safari-web-extension-converter`) ([Apple: packaging](https://developer.apple.com/documentation/safariservices/packaging-a-web-extension-for-safari)). On this machine `xcrun safari-web-extension-converter` fails because only Command Line Tools are installed; Xcode is required.
- Usage: `xcrun safari-web-extension-packager /path/to/extension` with options for project location, app name, bundle identifier, `--swift`/`--objc`, `--macos-only`/`--ios-only`, `--copy-resources`, `--no-open`, `--no-prompt`, `--force`, `--rebuild-project`. By default the generated project *references* the original extension folder rather than copying it, so rebuilding the Vite output updates the extension. Exact flag spellings are in `--help`; the Apple page lists them but the page text omits the literal flag names, so confirm with `--help`.
- Alternative: Xcode File > New > Project > macOS > App > "Safari Extension App" template ([Apple: creating](https://developer.apple.com/documentation/safariservices/creating-a-safari-web-extension)). It generates default Resources (manifest, background, content script, popup, images, `_locales`) that you then replace with the Vite output.
- Vite feeding resources: build to `dist/` (manifest.json, popup.html, JS, icons), run the packager once on `dist/` (no `--copy-resources`), then rebuild with Vite and Xcode > Product > Build to refresh ([Apple: running](https://developer.apple.com/documentation/safariservices/running-your-safari-web-extension)). Icons: PNG 48/64/96/128/256/512 for the extension, 16/19/32/38 toolbar ([Apple: creating](https://developer.apple.com/documentation/safariservices/creating-a-safari-web-extension)). Add `:root { color-scheme: light dark; }` for dark mode ([Apple: optimizing](https://developer.apple.com/documentation/safariservices/optimizing-your-web-extension-for-safari)).

## 6. Running an unsigned local build

- Quickest, no Xcode ([Apple: running](https://developer.apple.com/documentation/safariservices/running-your-safari-web-extension)): Safari > Settings > Advanced > "Show features for web developers"; Developer tab > "Add Temporary Extension..." and pick the extension folder or zip. Safari removes temporary extensions after 24 hours or on quit. Good for early iteration, but it is not the Xcode wrapper and has no stable install.
- With Xcode: in both the app and extension targets set Signing & Capabilities > Signing Certificate = "Sign to Run Locally" (Team = None) ([Apple sample: building and testing](https://developer.apple.com/documentation/safariservices/building-and-testing-a-safari-web-extension)). Product > Run launches the app, which registers the extension. Then enable "Allow unsigned extensions" (Safari 17+: Settings > Developer tab; Safari 16 and earlier: Develop > Allow Unsigned Extensions). That setting **resets every time Safari quits**. Then Safari > Settings > Extensions, tick the extension.
- Verify registration with `pluginkit -mAvvv -p com.apple.Safari.web-extension`; deployment targets of app and extension must be equal and not above the OS in use ([Apple: troubleshooting](https://developer.apple.com/documentation/safariservices/troubleshooting-your-safari-web-extension)).
- Debug the popup: click the toolbar button, Control-click the popup > Inspect Element ([Apple: troubleshooting](https://developer.apple.com/documentation/safariservices/troubleshooting-your-safari-web-extension)).
- Developer ID signing and notarization are out of scope.

## Not confirmed

- Whether opening the popup itself triggers activeTab / the permission popover flow, exactly what the user sees.
- Behavior on Safari internal pages, PDFs, extension gallery, view-source, private windows.
- Literal packager flag names (page text had them stripped).
- Whether the above Safari-bug items are fixed in 27.x.
