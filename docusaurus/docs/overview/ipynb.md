---
sidebar_position: 2
---

# Notebook guide

Ipynb2Web renders saved `.ipynb` cells into metadata, HTML content and optional
assets. The [getting started guide](getting-started.md) defines the supported
syntax, options, MIME order and trust contract.

Start with a small leading Markdown metadata cell:

```yaml
---
title: My notebook
keywords: [browser, example]
published: false
---
```

Then add ordinary Markdown content. No metadata cell is required.

```markdown
::: {.callout-note #note data-kind="example"}
The host styles this block.

[Some emphasized text]{.highlight title="A short explanation"}
:::

A note.^[Inline footnotes work.] A reference.[^one]

[^one]: A referenced footnote in the same cell.
```

Use code-cell options on consecutive leading lines:

```python
#| code-fold: true
#| output-fold: show
print("Save this cell's output in your notebook editor")
```

`echo:false`, `output:false` and `include:false` hide input, output or the whole
cell. `code-fold:true` creates closed details; `show` starts open. `output-fold`
is the corresponding Ipynb2Web extension. These options control rendering only.
An IPython magic without saved output is displayed as code and diagnosed, never
executed by this library.

Divs and spans preserve supported attributes; classes such as `tip`, `warning`,
`info`, `callout-note` or `panel-tabset` have no built-in styling or behavior.
Tabs, layouts and callouts are host responsibilities. This is a conventional
Markdown subset, not a Quarto publication engine.

The [local showcase](/test/index.html) demonstrates nested divs, span attributes,
footnotes, code folding, SVG attachments, escaped text and saved output diagnostics.
See the [migration note](migration.md) for legacy syntax and host integration changes.
