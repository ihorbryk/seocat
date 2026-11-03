# seocat

A Safari extension that shows SEO facts about the page currently loaded in the browser.

## Language

**Page**:
The document currently loaded in the active Safari tab that seocat inspects.
_Avoid_: Site, website, URL (when meaning the document itself)

**Metric**:
A single fact about the Page, such as the length of its meta title or its number of images.
_Avoid_: Indicator, parameter, field, stat

**Group**:
A named set of Metrics shown together on its own tab of the popup. There are three Groups: **Content** (what the Page says, such as its meta title and description), **Indexing** (how the Page instructs search engines, such as canonical, robots and hreflang) and **Images** (every Image on the Page with its alt text, address, pixel dimensions and file size).
_Avoid_: Section, category, data block

**Image**:
One `<img>` element of the Page, listed in document order; the same file used twice is two Images. Inline SVG, CSS backgrounds and favicons are not Images.
_Avoid_: Picture, photo, asset

**Not loaded**:
The state of an Image whose file the browser has not loaded, such as a lazy image below the fold or a broken one, so its pixel dimensions and file size are unknown.
_Avoid_: Broken, pending, missing (when the tag exists)

**Size unknown**:
The state of a loaded Image whose file size the browser does not reveal to seocat, typically a file from another origin.
_Avoid_: Unknown, n/a

**Missing**:
The state of a Metric whose source tag is absent from the Page.
_Avoid_: Not found, none, null

**Empty**:
The state of a Metric whose source tag is present but carries a blank value.
_Avoid_: Blank, missing (when the tag exists)

**Duplicate**:
The state of a Metric whose source tag appears more than once on the Page where one is expected.
_Avoid_: Multiple, repeated

**Length rating**:
How the length of a Metric's text value compares with its recommended range: **Short** (below it), **Good** (within it), or **Long** (above it). Only meta title and meta description have one.
_Avoid_: Length marker, score, status, grade

**Unreadable**:
The state of a Page that Safari does not let seocat access, such as Safari's own internal pages.
_Avoid_: Unsupported, blocked, restricted

**Not HTML**:
The state of a Page whose document is not HTML, such as a PDF, plain text or JSON.
_Avoid_: Unsupported, non-page
