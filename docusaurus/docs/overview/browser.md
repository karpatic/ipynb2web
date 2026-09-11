---
sidebar_position: 1
---

# Browser integration

Build the repository with `npm run build`. The ESM and UMD browser bundles include
all parser dependencies; a separate Marked script is no longer used.

```html
<article id="notebook"></article>
<script type="module">
  import ipynb2web from './dist/ipynb2web.browser.mjs';
  const result = await ipynb2web.nb2json('./notebook.ipynb');
  document.getElementById('notebook').innerHTML = result.content;
  console.log(result.meta, result.diagnostics);
</script>
```

Alternatively load `dist/ipynb2web.browser.umd.js` as a regular script and use
`window.ipynb2web`. Serve the bundle from a host-chosen location or a deliberately
pinned published version after it is released. This checkout's changes are not
necessarily present in any registry version.

`nb2json` fetches and converts. `renderNotebook` accepts already-parsed notebook
JSON. Both return content without mounting it or executing scripts. See
[trust and mount lifecycle](getting-started.md#trust-and-mount-lifecycle) before
using `trusted:true` for saved interactive output.

For arbitrary uploads, preview inside an iframe with an empty `sandbox`. Default
conversion is inert, but preserved attributes may invoke behavior in a host that
mounts them in its own DOM. The [showcase](/test/index.html) demonstrates isolated
mounting and reports conversion failures through `textContent`.
