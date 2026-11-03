# Structure and location of the v1 spec

Map: [seocat v1](../map.md)
Type: grilling
Status: out of scope
Blocked by: —

## Question

How is the implementation-ready v1 spec assembled from the closed tickets, so that a separate session can build seocat from it without making further decisions?

- Where it lives (a file in the repo such as `docs/spec/v1.md`, a GitHub issue, or both) and which language it is written in.
- Its structure: one document, or a spec plus a build-order of slices; whether it restates each decision or links to the ticket that holds it (the tickets live in `.scratch/`, which is not committed yet, so links into it may not survive).
- What goes into ADRs in `docs/adr/` versus the spec, given the decisions made (for example, trying `executeScript` over a URL filter, `files` over `func`, the committed Xcode project).
- Which prototype and research assets are carried over or referenced, and what happens to `.scratch/seocat-v1/` afterwards.

## Out of scope

Closed on 2026-11-03 without resolving. Assembling the spec is not a decision on this map: once the map is clear, the effort hands off to `/to-spec`, which fixes the spec's structure (its template), its location (the issue tracker) and restates the decisions inline. The one leftover question, which decisions deserve ADRs, is settled during `/to-spec`.
