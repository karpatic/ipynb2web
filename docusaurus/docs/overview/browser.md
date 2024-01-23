---
sidebar_position: 1
---

# Browser Side

This guide provides a user-oriented walkthrough of the browser module of ipynb2web. For detailed API documentation, please refer to the [official documentation](https://karpatic.github.io/ipynb2web/jsdocs/module-browser.html).

## Content Delivery Network (CDN)

You can include `ipynb2web` in your project via CDN with either of these URLs:

```plaintext
https://cdn.jsdelivr.net/npm/ipynb2web@latest
```

or

```plaintext
https://unpkg.com/ipynb2web@latest
```

## Usage

To convert a Jupyter notebook to JSON, use the `nb2json(path)` function.

## Browser Integration (Non-Module)

This method is for simple scripts and does not require ES module support.

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
      console.log(window.marked);
    </script>
    <script src="https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser.umd.js"></script>
  </head>
  <body>
    <script>
      const url =
        "https://api.charleskarpati.com/vanillapivottable/index.ipynb";
      ipynb2web.nb2json(url);
      // returns: { meta: { ... }, content: { ... } }
    </script>
  </body>
</html>
```

## Browser Integration (ESM Module)

For modern browsers that support ES modules, you can use the following approaches.

### Approach One

This approach uses module script tags.

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser.mjs"
    ></script>
  </head>
  <body>
    <script type="module">
      ipynb2web.nb2json(url);
      // returns: { meta: { ... }, content: { ... } }
    </script>
  </body>
</html>
```

### Approach Two

This approach uses ES module imports.

```html
<!DOCTYPE html>
<html>
  <head> </head>
  <body>
    <script type="module">
      import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
      import { ipynb2web } from "https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser.mjs";
      // import ipynb2web from 'https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser.mjs'; // Either works
      ipynb2web.nb2json(url);
      // returns: { meta: { ... }, content: { ... } }
    </script>
  </body>
</html>
```

Ensure to replace the URLs with the appropriate versions and paths as per your project requirements.
