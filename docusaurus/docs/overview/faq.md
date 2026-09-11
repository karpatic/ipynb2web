---
sidebar_position: 4
---

# Questions

## What does it produce?

`meta`, HTML `content`, optional `assets`, and structured `diagnostics`. The host
owns templates, routing, CSS, script activation and mount cleanup.

## Does it run notebooks or Quarto projects?

No. It renders Markdown, code inputs and saved outputs from `.ipynb` files.
Conventional fenced divs, attributed spans, footnotes and selected code options
are supported. Math, bibliography processing, `.qmd` execution and themes are
outside the supported subset.

## Why does a JavaScript magic not run?

Magics are input for the notebook's kernel. Save the generated outputs in your
notebook toolchain. Trusted saved JavaScript can be preserved by conversion, but
the host still decides how to activate it after mounting. See the
[trust contract](getting-started.md#trust-and-mount-lifecycle).

## Are errors removed?

No. Saved errors and stderr are visible escaped text, and diagnostics identify
unsupported or missing content. Code options can deliberately hide saved outputs.
