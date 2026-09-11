# Ipynb2Web

An embeddable browser/build renderer for saved Jupyter notebooks. It returns
`{ meta, content, assets, diagnostics }`; your webpage owns CSS, routing,
presentation, and attribute-driven behavior.

The supported authoring subset includes YAML metadata, Markdown, Pandoc-style
fenced divs and attributed spans, footnotes, and rendering options on code cells.
It does not execute Python, JavaScript, IPython magics, or `.qmd` files. Math,
bibliographies, execution toolchains, and themes are outside its scope. Support
for these authoring conventions does not imply full Pandoc or Quarto compatibility.

## Browser

Build with `npm ci && npm run build`, then serve the repository with
`npx http-server . -p 8097 -c-1`. Open
[the local showcase](http://localhost:8097/docusaurus/static/test/index.html).
It uses the local browser bundle, not a published package.

```html
<article id="notebook"></article>
<script type="module">
  import ipynb2web from './dist/ipynb2web.browser.mjs';
  const result = await ipynb2web.nb2json('./notebook.ipynb');
  document.getElementById('notebook').innerHTML = result.content;
  console.log(result.meta, result.diagnostics);
</script>
```

The browser bundles include their parsers; no additional script imports are
needed. The UMD build is `dist/ipynb2web.browser.umd.js` and exposes
`window.ipynb2web`.

## Build

```js
import { readFile, writeFile } from 'node:fs/promises';
import ipynb2web from 'ipynb2web';

const notebook = JSON.parse(await readFile('./notebook.ipynb', 'utf8'));
const result = ipynb2web.renderNotebook(notebook);
await writeFile('./notebook.json', JSON.stringify(result));
```

`renderNotebook(notebook, options)` needs no server. `nb2json(url, options)`
fetches first. The older `nb2json(path, verbose, extractAssets, options)` signature
is retained, including extensionless Node paths served at localhost:8085.

Host options:

- `trusted: true`: preserve raw HTML and saved HTML/JavaScript outputs. The default
  escapes raw HTML, filters active authoring attributes, and uses inert saved-output
  representations. A notebook metadata field named `trusted` cannot enable this.
- `extractAssets: true` or an array such as `['png', 'svg', 'html', 'js']`: return
  selected assets with `placeholderName`, `data`, `encoding`, and `type`. Write them
  and replace `ASSET_PLACEHOLDER_<name>` in content with host-chosen URLs. Inlining
  is the default. Rich asset extraction also requires `trusted: true`.
- `externalLinks: 'new-tab'`: opt into `target="_blank"` with `noopener noreferrer`
  for Markdown HTTP(S) links. Default links have no imposed target or relation.
- `filename`: fallback metadata filename and asset prefix; `verbose`: log diagnostics.

## Authoring

Use a leading Markdown or raw cell with explicit YAML delimiters. Flat metadata
and inline arrays are enough for most notebooks:

```yaml
---
title: "A notebook: example"
keywords: [notebooks, browser]
hide: false
host:
  route: /examples/notebook
---
```

Nested mappings, lists, quoted strings, booleans and numbers keep their types.
Metadata is optional. Ordinary first cells are rendered; content after the closing
YAML delimiter is retained. Invalid explicit YAML throws a cell-specific error.
Mappings require string keys; custom tags, aliases and nonfinite numbers are
rejected. Prototype-named keys remain inert own properties, including nested keys.
Do not merge untrusted metadata into host configuration without validation.

Legacy cells containing only headings, blockquotes and `- key: value` fields are
still recognized when at least one field is present. Values such as `[one, two]`
and `false` are normalized; unparseable legacy prose remains a string. A heading
alone is content. Arbitrary host keys are retained, including `toc`, `audio`,
`cover`, `collapse`, `collapsable`, `prettify`, and routing metadata; these do not
select renderer behavior.

```markdown
:::: {#example .callout-note data-kind="aside" title="Host-styled note"}
A paragraph with [an **attributed** span]{.smallcaps #term title="Two words"}.

::: {.tip}
- Nested blocks keep their structure.
- The host supplies any callout styling.
:::
::::

An inline note.^[This is a note.] A referenced note.[^source]

[^source]: A conventional footnote definition in this Markdown cell.
```

Div fences use at least three colons and may nest, including equal-length fences.
Code fences, inline code and raw HTML literal blocks are not rewritten. Attribute
lists on divs/spans support classes, IDs and quoted/unquoted key-value attributes.
In default mode supported inert attributes include `data-*`, `aria-*`, `title`,
`lang`, `dir`, `role`, `tabindex`, `hidden`, `width`, and `height`; other attributes
require trusted rendering. Footnotes use conventional linked endnotes, scoped per
Markdown cell. Definitions and references must be in the same cell. Attributes may also follow
a note, such as `^[note]{.tip title="Note title"}`.

## Inputs and saved outputs

Ordinary code inputs are escaped and visible. Multiple leading option lines work:

```python
#| echo: true
#| code-fold: show
#| output-fold: true
print("Saved output is rendered separately")
```

| Option | Rendering |
| --- | --- |
| `echo: false` | Hide input |
| `output: false` | Hide saved outputs |
| `include: false` | Hide the whole cell |
| `code-fold: true` / `show` / `false` | Closed / initially open / unfolded input |
| `output-fold: true` / `show` / `false` | Equivalent saved-output folding; Ipynb2Web extension |

Only the contiguous leading option/legacy flag lines are scanned. The first body
line ends scanning, so flags in strings or later comments are literal code.
Conventional options override legacy equivalents regardless of their ordering;
last valid value wins within each syntax. `include:false` takes precedence over
both visibility options; hidden content is not folded. Invalid/unsupported options
produce diagnostics.

Legacy `#hide`, `#hide_input`, `#hide_output`, `#collapse_input`,
`#collapse_input_open`, `#collapse_output`, `#collapse_output_open`, and `#export`
remain supported. Magics such as `%%capture`, `%%html`, and `%%javascript` remain
visible source; they are not renderer instructions. With no saved outputs, they
produce an unexecuted-magic diagnostic. To create interactive output, run the
notebook in its own toolchain and save its outputs first.

For MIME alternatives, trusted rendering chooses HTML, then JavaScript, SVG,
PNG, JPEG, WebP, GIF, plain text, then JSON. Default rendering skips active MIME
choices, preferring images/plain text/JSON and otherwise displaying rich output
as escaped text. Empty/invalid images fall back to another representation. SVG
is a URL-backed image, not injected SVG markup. Attachments use the same image
handling. Plain text, streams, stderr and saved errors are escaped and visible.
Missing/unsupported outputs and attachments produce a visible placeholder and
structured diagnostics with a one-based cell number.

## Trust and mount lifecycle

Conversion returns strings and assets; it does not mount or execute scripts.
`innerHTML` insertion does not execute inserted script elements, but trusted HTML
can contain event handlers, frames and other active content that needs no explicit
script activation. Use `trusted:true` only for content the host intentionally
allows to have its privileges, never because a notebook says it is trusted.

The default is an inert rendering subset, not a general HTML sanitizer or a host
security boundary. Preserved IDs/classes/data attributes may trigger your own
host code. For arbitrary uploads, use an isolated preview: the showcase mounts
in an iframe with an empty `sandbox`, without script or same-origin permissions.
Do not combine `allow-scripts` and `allow-same-origin` for untrusted same-origin
content. Choose URL/network policy, CSP and any further sanitization in the host.

For trusted interactive outputs the host mounts content, loads any approved
libraries, then explicitly activates approved scripts or calls its own mount
hooks. The host must handle load order, failures, CSP, repeated mounts, event
listeners, timers and cleanup before replacing a page. Extracted HTML in an iframe
is a separate document and may execute on navigation, subject to the host's sandbox
and CSP. The renderer does not supply a script scheduler or dependency loader.

Unicode/emoji are preserved. No highlighter, CSS theme, external CDN script,
header-folding policy or link `nofollow` is selected by notebook content. The host
can style ordinary code elements and implement behavior from preserved attributes.

## Migration and development

See [migration notes](https://github.com/karpatic/ipynb2web/blob/main/docusaurus/docs/overview/migration.md), the
[notebook guide](https://github.com/karpatic/ipynb2web/blob/main/docusaurus/docs/overview/ipynb.md), and the
[showcase](https://ipynb2web.com/test/index.html). Older directory, sitemap, audio,
cover and Python-export utilities remain available; they are separate from the
core renderer contract.

The renderer uses `markdown-it`, its footnote plugin, and `yaml`. Run `npm test`
for focused conversion checks, `npm run build` for package bundles, and
`npm run docs` to regenerate API/site documentation. Build does not globally
link the package or publish a release. Release commands require a separate,
intentional publishing step; package metadata and `.github/workflows` retain
that wiring.
