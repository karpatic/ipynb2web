# Ipynb2Web

[![npm version](https://badge.fury.io/js/ipynb2web.svg)](https://badge.fury.io/js/ipynb2web)
[![HitCount](https://hits.dwyl.com/karpatic/ipynb2web.svg?style=flat-square)](http://hits.dwyl.com/karpatic/ipynb2web)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/karpatic/ipynb2web/total)
![GitHub repo size](https://img.shields.io/github/repo-size/karpatic/ipynb2web)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM](https://nodei.co/npm/ipynb.png)](https://nodei.co/npm/ipynb/)

This project is complete with dedicated API and also usage documentation. Read below to get started.

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

```
npm install ipynb2web
```

## Usage

You convert a notebook with: `nb2json(path)`

### CLI

In its most generic form, the cli is executed like so:

```
ipynb2web <COMMAND> <SAVETO> <FROM/or/SitemapName>
```

It's is best demonstrated through sequential use all 3 of it's commands.

1. Convert directories with ipynb's to json docs

and

2. Create Navigation json for each directory:

```
ipynb2web DirectoryName "custom/SAVETO/path/" "custom/FROM/path/"
```

3. Create a Sitemap.txt from multiple section navigations:

```
ipynb2web sitemap "custom/sitemap/path.txt
```

4. Create Audio versions of the documents if the ipynb frontmatter requests it. Requires `OPENAI_API_KEY` stored in your `.env` file:

```
ipynb2web audio
```

### Node.js

Import using ESM:

```
// import { ipynb2web } from './../src/node.js';
// or
import ipynb2web from './../src/node.js';
```

Import using CJS:

```
// const ipynb2web = require('../dist/ipynb2web.cjs').default;
// or
const { ipynb2web } = require('../dist/ipynb2web.cjs');
```

Usage:

```
const prepairedJsonAsset = ipynb2web.nb2json(url)
```

Returns:

```
{ meta: { ... }, content: { ... } }
```

### Browser (Non Module)

```
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>console.log(window.marked)</script>
    <script src="https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser.umd.js"></script>
</head>
<body>
    <script>
        const url = 'https://api.charleskarpati.com/vanillapivottable/index.ipynb';
        // Either:
        // ipynb2web.nb2json(url)
        // or
        ipynb2web.nb2json(url)
        // returns: { meta: { ... }, content: { ... } }
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
        // returns: { meta: { ... }, content: { ... } }
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
        import { ipynb2web } from 'https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser.mjs';
        ipynb2web.nb2json(url)
        // returns: { meta: { ... }, content: { ... } }
    </script>
</body>
</html>
```
