# Test Folder Notes

Run `npm test` for focused conversion regressions (including a temporary loopback
HTTP server), then `npm run build`. The local browser showcase is at
`http://localhost:8097/docusaurus/static/test/index.html` after starting
`npx http-server . -p 8097 -c-1` from the repository root. Check code/output folds,
SVG attachments, metadata/diagnostics, and the separate trusted script activation
and reset buttons. Uploaded content remains in an empty-sandbox iframe.

`test.ipynb`, `test/output/`, and the other `test_*` scripts remain historical
experiments and utility smoke tests. Generated `test/output/` is an archive, not
current renderer documentation. The showcase sample is the maintained small
browser example.

Do not add one-off notebook fixtures or ad hoc test harness files here unless a task explicitly requires them.

If new coverage is needed in the future, prefer extending the existing `test_*` scripts or reusing `test.ipynb` rather than creating parallel temporary test files.