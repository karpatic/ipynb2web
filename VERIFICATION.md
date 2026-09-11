# Renderer verification

Author: Codex app agent · September 11, 2026

Scope: this repository only. Karpatic consumer inspection was read-only; no
external notebook edits/builds, registry releases, tags, or version bump.

## Reproduced before implementation

- Legacy `[one, two]` and `false` metadata were strings.
- Ordinary and collapsed inputs returned `undefined`; initially open inputs rendered.
- Only the first source line supplied flags.
- Fenced divs produced `<p><div>…</div></p>`.
- JavaScript magic without saved output did not execute or render output.
- Triple-parenthesis breakout syntax was recommended but not converted.

## Results

- `npm test`: passed on Node 22.23.2 and Node 18 (via `npm exec --package=node@18`).
  Checks cover typed/legacy metadata, prototype keys, malformed YAML, first-cell
  preservation, div nesting and literal content, span/note attributes, both
  footnote forms, option precedence/body boundaries, MIME fallbacks, escaping,
  SVG/attachments, trust, asset naming, HTTP failures and concurrent conversions.
- `npm run build`: all eight webpack targets completed. Direct rendering checks
  matched source results across ESM, CommonJS and UMD, minified and unminified.
- `npm run builddocs` and `npm run builddocu`: completed. The site and showcase
  include the same current browser bundle as `dist`.
- `npm pack --dry-run` and a local tarball installation with `--omit=dev`: passed.
  ESM and CommonJS imports rendered the same result. The Node entry point's
  existing `http-server` import now has a runtime dependency declaration.
- `cli_nbs2html` against the maintained sample: completed, wrote JSON and an SVG
  attachment under `/tmp/ipynb2web-cli-check/`.
- Actual Chrome interaction: closed Code disclosure opened; trusted saved script
  stayed inactive after conversion/insertion, ran on explicit host activation,
  and returned to the inactive state after reset.
- Chrome DOM inspection: zero `p > div` nodes; quoted attributes preserved;
  two footnotes; input folds initially `[closed, open]`; output fold initially
  open; SVG attachment loaded with natural width 300.
- Browser trust probe: notebook `trusted:true` metadata did not enable raw HTML,
  an event attribute was removed and diagnosed, saved HTML used its plain-text
  fallback, and the host page remained intact. Preview sandbox has no permissions.

## Review artifacts

Serve the repository with `npx http-server . -p 8097 -c-1`:

- Built showcase: http://127.0.0.1:8097/docs/test/index.html
- Source showcase: http://127.0.0.1:8097/docusaurus/static/test/index.html
- Build result JSON: `/tmp/ipynb2web-verification.json`
- Local package: `/tmp/ipynb2web-1.0.42.tgz`
- Build logs: `/tmp/ipynb2web-build.log`, `/tmp/ipynb2web-jsdocs.log`,
  `/tmp/ipynb2web-docs.log`

The original unwritable dependency tree was preserved as `.node_modules-preflight/`
and excluded locally in `.git/info/exclude`. A writable `node_modules/` was
installed; no system-wide dependency links were changed.

## Limits and nonfatal warnings

Footnote definitions are scoped to a Markdown cell; hosts mounting multiple
notebooks together must namespace IDs. YAML aliases/custom tags are rejected.
HTML/JS activation, CSS, CSP, network policy and mount cleanup remain host-owned.
No execution, math, bibliography, `.qmd` toolchain or themes were added.

The preview now sets `about:srcdoc` as its base so fragment links stay in the
notebook instead of loading the surrounding showcase. Chrome's extension could
inspect the corrected links but could not inspect the frame after navigation to
`about:srcdoc#…`; post-click footnote inspection is a verification limitation.

Webpack reported bundle-size advisories (about 250 KiB minified browser bundle).
Docusaurus reported stale Browserslist data and an unwritable existing build
cache; it still generated the production site successfully. These warnings did
not require changes to unrelated tooling.
