---
sidebar_position: 1
---

# Server Side

This guide provides a user-oriented walkthrough of the CLI module of ipynb2web. For detailed API documentation, please refer to the [official documentation](https://ipynb2web.com/jsdocs/module-Ipynb2web_browser.html)

## Installation

Install `ipynb2web` for Node.js environments using npm:

```bash
npm install ipynb2web
```

## Usage

Convert Jupyter notebooks to JSON using the `nb2json(path)` function.

### Importing ipynb2web in Node.js

#### Using ECMAScript Modules (ESM)

```javascript 
import ipynb2web from ipynb2web;
```

#### Using CommonJS (CJS)

```javascript
// Option 1
const ipynb2web = require("ipynb2web").default;
// Option 2
const { ipynb2web } = require('ipynb2web');
```

### Using ipynb2web

```javascript
const preparedJsonAsset = ipynb2web.nb2json(url);
// Returns: { meta: { ... }, content: { ... } }
```

## Documentation

For more details on the Node.js implementation of ipynb2web and its functionalities, refer to the [official documentation](https://karpatic.github.io/ipynb2web/jsdocs/module-node.html).

## Core Functionalities

The Node.js version of ipynb2web exposes various functionalities, including the conversion of notebooks to HTML, creation of audio files, generation of sitemaps, and publishing processed files:

- `createAudio(from, to)`: Converts content to audio files, based on YAML 'audio' tags.
- `createSitemap(search, sitemapFile, pathPrefix, verbose)`: Generates sitemaps for web navigation. Supports optional path prefix for subdirectory deployment.
- `cli_nbs2html(FROM, directory, SAVETO, verbose)`: Processes .ipynb files and converts them to HTML.
- `generate_sectionmap(pages, FROM, directory, SAVETO, verbose)`: Creates a section map for directories.
- `ipynb_publish(fullFilePath, saveDir, type)`: Processes and publishes Jupyter Notebook files, converting them to specified formats.

### Notes

- `createAudio`: This function checks the YAML for 'audio' tags and creates corresponding audio files.
- `createSitemap`: It appends each ipynb file to a 'sitemap.txt', useful for site navigation.
- `cli_nbs2html`: This function is used for processing files in place, particularly useful when converting notebooks via the command line.
- `generate_sectionmap`: It assists in creating section maps for directories, aiding in structured navigation.
- `ipynb_publish`: This function converts notebooks to different formats and saves them, optionally extracting Python code.
