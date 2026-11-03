# AGENTS.md

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for `ihorbryk/seocat` (via the `gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Codebase

Before adding a Metric or a Group, touching the build, or writing tests, read `docs/agents/codebase.md`. Review rules: `CODING_STANDARDS.md`.

After changing `src/ui/`, `src/popup/` or a Group's `View`/`Header`, run `mise run showcase`, screenshot the affected scenarios in light and dark, and list only the Safari-only criteria in your report (see "Showcase" in `docs/agents/codebase.md`).

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
