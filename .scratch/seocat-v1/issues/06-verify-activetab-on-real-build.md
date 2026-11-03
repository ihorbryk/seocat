# Verify page access on a real local build

Map: [seocat v1](../map.md)
Type: task
Status: resolved
Assignee: Ihor Bryk
Blocked by: 01

## Question

Install Xcode (only the Command Line Tools are on this machine), build a throwaway minimal MV3 extension (a popup that calls `scripting.executeScript` and returns `document.title`) with "Sign to Run Locally", and record the facts:

- Does opening the popup grant `activeTab`, or does Safari first ask for per-site access? What exactly does the user see (badge, popover)?
- What happens on Safari internal pages, a PDF in the viewer, a `.txt`/`.json` document, and a `file:` URL?

This is a throwaway check, not v1 code. The facts feed the "Unsupported and empty states" decision.

## Progress

- 2026-11-03: Xcode 27.2 (build 27B52) installed at `/Applications/Xcode-27.2.0.app` via `xcodes` and selected with `xcode-select`. `xcrun --find safari-web-extension-packager` resolves. The prerequisite is done; the throwaway build and the checks are still open.
- 2026-11-03: Built the throwaway extension (MV3, `activeTab` + `scripting`; the popup prints `tab.url`, `permissions.contains` and the `executeScript` result or error verbatim). Project generated with `safari-web-extension-packager --macos-only --swift`, built with `xcodebuild` and ad-hoc signing (`CODE_SIGN_IDENTITY=-`, the CLI equivalent of "Sign to Run Locally"): `BUILD SUCCEEDED`, extension registered (`dev.ihorbryk.seocat-probe.Extension`). Side fact: the packager warns "manifest.json is missing icons" and adds no icons, but the project still builds.

## Answer

Checked by hand in Safari 27.2 on macOS 27.2 on 2026-11-03, using the throwaway probe (source and build in the session scratchpad, not kept).

- **Enabling the extension:** Safari showed an access request when the extension was turned on in Settings > Extensions.
- **Opening the popup grants `activeTab`.** On an https page that had no site access, the popup ran `executeScript` straight away (2 ms) with no per-site prompt, badge or popover. `permissions.contains({ origins: [url] })` still returned `false`: an `activeTab` grant does not show up as a permission, so v1 must not use `permissions.contains` to predict access.
- **Safari internal pages (Start Page, `favorites://`):** `executeScript` does **not** throw. It resolves with one frame entry that has `result: null` and `error: "Failed to execute script. Extension does not have access to this frame."` `permissions.contains` throws on that URL ("'favorites://' is not a valid pattern"). Detecting failure therefore means checking the per-frame `error` field as well as catching exceptions.
- **PDF in the built-in viewer:** the script runs and returns `contentType: "application/pdf"`, an empty `title` and `bodyChars: 0`. Nothing fails, so "not an HTML page" has to come from `document.contentType`, not from an error.
- **Not checked:** `.txt`/`.json` documents and `file:` URLs (both HTML and non-HTML). The research already lists `file:` as a known failure. The PDF result suggests non-HTML documents also run and report their own `contentType`, but that has not been verified.
