# Ipynb2Web

1. Process Ipynb's into JSON assets ready for website templating.
2. Light weight with minimal dependencies
3. For client and servers. Available in all forms and flavors.

Both Server and Client side implementations can be used to get a `{content, meta}` object.

The server-side implementation can traverse directories and create JSON assets for directory-based navigation - which can ve used to generate a sitemaps.txt and produce accompanying image and audio-transcription assets using openAI.

## CDN

https://cdn.jsdelivr.net/npm/ipynb2web@latest

or

https://unpkg.com/ipynb2web@latest

## Installation

`npm install ipynb2web`

## Usage

You convert a notebook with: `nb2json(path)`

### CLI

1. Convert directories with ipynb's to json docs

and

2. Create Navigation json for each directory:

`ipynb2web DirectoryName "custom/SAVETO/path/" "custom/FROM/path/"`

3. Create a Sitemap.txt from multiple section navigations:

`ipynb2web sitemap "custom/sitemap/path.txt"`

4. Create Audio versions of the documents if the ipynb frontmatter requests it. Requires `OPENAI_API_KEY` stored in your `.env` file:

`ipynb2web audio`

### Node.js

```
// ESM
import { convert } from 'ipynb2convert';

// CJS
const ipynb2web = require('../dist/ipynb2web.main.cjs');
const { convert } = ipynb2web;

const prepairedJsonAsset = convert.nb2json(url)
```

### Browser (Non Module)

```
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>console.log(window.marked)</script>
    <script src="https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser-umd.js"></script>
</head>
<body>
    <script>
        const url = 'https://api.charleskarpati.com/vanillapivottable/index.ipynb';
        // Either:
        // ipynb2web.nb2json(url)
        // or
        Convert.nb2json(url)
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error(error);
            });
    </script>
</body>
</html>
```

### Browser (ESM Module)

```
<!DOCTYPE html>
<html>
<head>
    <!--
    // Module import method 1
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser.mjs"></script>
    -->
</head>
<body>
    <!--
    <script type="module">
        // Module method 1 continued ...
        const url = 'https://api.charleskarpati.com/vanillapivottable/index.ipynb';
        ipynb2web.nb2json(url)
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error(error);
            });
    </script>
    -->
    <script type="module">
        // Module import method 2
        import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
        const url = 'https://api.charleskarpati.com/vanillapivottable/index.ipynb';
        // Either
        // import ipynb2web from 'https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser.mjs';
        // ipynb2web.nb2json(url)
        // or
        import { Convert } from 'https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser.mjs';
        Convert.nb2json(url)
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error(error);
            });
    </script>
</body>
</html>
```
