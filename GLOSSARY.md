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
A named set of Metrics shown together. Version 1 has exactly one Group.
_Avoid_: Section, tab, category, data block

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
