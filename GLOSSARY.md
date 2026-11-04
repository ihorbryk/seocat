# seocat

A Safari extension that shows SEO facts about the page currently loaded in the browser.

## Language

**Page**:
The document currently loaded in the active Safari tab that seocat inspects.
_Avoid_: Site, website, URL (when meaning the document itself)

**Metric**:
A single fact about the Page, such as the length of its meta title or its number of links.
_Avoid_: Indicator, parameter, field, stat

**Group**:
A named set of Metrics shown together on its own tab of the popup. There are four Groups: **Content** (what the Page says, such as its meta title and description, its word count and its Outline), **Indexing** (how the Page instructs search engines, such as canonical, robots and hreflang), **Images** (every Image on the Page with its alt text, address, pixel dimensions and file size) and **Links** (every Link on the Page with its anchor text, address, whether it is Internal or External, and whether it is Nofollow).
_Avoid_: Section, category, data block

**Image**:
One `<img>` element of the Page, listed in document order; the same file used twice is two Images. Inline SVG, CSS backgrounds and favicons are not Images.
_Avoid_: Picture, photo, asset

**Link**:
One `<a>` element of the Page that has an `href`, listed in document order, whatever its scheme (`mailto:`, `tel:`, a fragment); the same address used twice is two Links. `<area>` and `<link>` are not Links.
_Avoid_: Anchor (when meaning the element), URL, href

**Anchor text**:
The text a Link shows: its text content, or the alt of an Image inside it when it has no text. A Link with neither has Empty anchor text.
_Avoid_: Link text, title, label

**Heading**:
One `<h1>`–`<h6>` element of the Page, hidden or not, listed in document order; its level is the digit of its tag. Its text is its text content, or the alt of an Image inside it when it has no text; a Heading with neither is an Empty heading. Elements that only claim to be headings through ARIA are not Headings.
_Avoid_: Title, header, subheading

**Outline**:
Every Heading of the Page in document order, each indented by its own level rather than by the level of the Heading before it, so a skipped level stays visible.
_Avoid_: Heading tree, structure, table of contents

**Internal**:
A Link whose address points to the Page's own host, ignoring a leading `www.`, the scheme and the port; a fragment on the Page itself is Internal. Subdomains are not the same host.
_Avoid_: Local, on-site

**External**:
A Link whose web address points to any other host, including a subdomain of the Page's host. A Link with a non-web scheme such as `mailto:` or `tel:` is neither Internal nor External.
_Avoid_: Outbound, off-site, foreign

**Nofollow**:
A Link whose `rel` asks search engines not to pass trust through it: `nofollow`, `sponsored` or `ugc`.
_Avoid_: Dofollow (as the opposite term), blocked

**Not loaded**:
The state of an Image whose file the browser has not loaded, such as a lazy image below the fold or a broken one, so its pixel dimensions and file size are unknown.
_Avoid_: Broken, pending, missing (when the tag exists)

**Size unknown**:
The state of a loaded Image whose file size the browser does not reveal to seocat, typically a file from another origin that sends no CORS headers.
_Avoid_: Unknown, n/a

**Heavy**:
An Image whose file is loaded, whose file size is known, and whose file size is above 1 MB. An Image that is Not loaded or Size unknown is never Heavy.
_Avoid_: Large, big, oversized

**Filter**:
A header tile of the Images or Links Group that narrows the list to the entries in one state, such as Internal or Heavy. At most one Filter is active at a time, and its count always describes the whole Page.
_Avoid_: Tab, category

**Search**:
Text typed above the list of Images or Links that narrows it to the entries whose alt or Anchor text, or whose address, contains it. It combines with the active Filter and never changes the Filter counts.
_Avoid_: Text filter, query filter

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
