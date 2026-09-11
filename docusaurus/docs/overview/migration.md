---
sidebar_position: 5
---

# Renderer migration

Author: Codex app agent · September 11, 2026

These notes describe this checkout's renderer changes; no registry release is
implied. Consumer inspection was read-only.

## Conventional authoring

Replace the obsolete triple-parenthesis breakout form (three opening parentheses,
a class name, `::`, body text, then three closing parentheses) with a fenced div:

```markdown
::: {.info}
Everything you are reading was made in a notebook.
:::
```

Use `.tip`, `.warning`, `.info`, or another host class. No special class engine is
installed. The historical implementation did not actually convert the documented
breakout syntax. The in-repo experiment now uses fenced divs; historical generated
experiment output is retained as an archive, not a recommended example.

A read-only scan found triple-parenthesis occurrences in Karpatic's
`ipynb/depricated/labs_scooter_exploration.ipynb` (cell 7),
`ipynb/depricated/labs_meetup.ipynb` (cell 6), and
`ipynb/labs/02_211_web_scraper.ipynb` (cell 6). All three are Markdown `.info`
breakouts that can migrate to fenced divs. No Karpatic files were changed or built.

## Host adoption

Karpatic's `src/utils/route.js` calls `nb2json(url, false)` and
`src/utils/refresh_template.js` separately reinserts scripts. When adopting this
version for its own trusted content, the host should deliberately pass
`nb2json(url, false, false, { trusted: true })`, or the options-object equivalent.
Do not use this opt-in for arbitrary uploads. Existing published content and the
external host were left untouched.

Default conversion now escapes raw HTML and active saved outputs, allowing inert
fallbacks. The showcase's old `allow-scripts allow-same-origin` preview was removed;
its iframe has no script or same-origin permissions. Host trust is an API option,
never a notebook field. Conversion and `innerHTML` insertion do not activate
scripts. Saved JS uses a script resource URL; hosts that activate scripts must
support `src`, load errors, ordering and their own CSP. Extracted HTML frames need
an explicit host sandbox policy.

`prettify`, `collapse`, `collapsable`, cover/audio and site navigation metadata now
pass through without selecting renderer behavior. Supply highlighter/CSS and
header folding in the host. Unicode is unchanged. Markdown links no longer receive
a forced target or `nofollow`; `externalLinks:'new-tab'` retains an opt-in new-tab
behavior with `noopener noreferrer`.

`convertNotes` is retained as a compatibility utility accepting Markdown source,
not already-rendered HTML. Inline notes now use linked endnotes, so hosts styling
the former checkbox markup should update to footnote markup. Use a distinct wrapper
or rewrite cell-scoped IDs if mounting multiple notebooks in one host document.

## Metadata, code and assets

Legacy metadata values become typed where possible. Heading-only cells remain
content; legacy metadata recognition requires a list field. Explicit YAML errors
throw instead of falling back. YAML aliases and custom tags are rejected; prototype
keys remain inert own properties. Hosts must still validate metadata before using
it as configuration. Add an explicit frontmatter block to remove ambiguity.

Ordinary input is now visible, including IPython magics. Use `echo:false` to hide
it. Multiple leading flag lines are recognized; `#|` options override equivalent
legacy flags. See the guide for precedence. `output-fold` is an extension, not a
claim of general Quarto option support.

Saved plain text/streams are escaped. Stderr and saved errors are now visible;
use `output:false` when intentional. Unsupported/missing MIME data and attachments
are diagnosed instead of silently dropped. MIME selection is deterministic; short
and array-valued images work, and SVG is correctly URL-encoded or extracted as UTF-8.
Requested HTML/JS assets are extracted regardless of size with distinct names.
Assets and counters belong to each conversion; concurrent fetches do not mix them.

## Verification

Run `npm test`, `npm run build`, and open the local showcase after starting
`npx http-server . -p 8097 -c-1`. The showcase loads the built local bundle and
includes a separate, deliberately trusted saved-script activation example. Its
sandboxed uploaded-content preview never activates notebook scripts.
