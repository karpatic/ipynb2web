# Getting Started

[![npm version](https://badge.fury.io/js/ipynb2web.svg)](https://badge.fury.io/js/ipynb2web)
[![HitCount](https://hits.dwyl.com/karpatic/ipynb2web.svg?style=flat-square)](http://hits.dwyl.com/karpatic/ipynb2web)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/karpatic/ipynb2web/total)
![GitHub repo size](https://img.shields.io/github/repo-size/karpatic/ipynb2web)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM](https://nodei.co/npm/ipynb.png)](https://nodei.co/npm/ipynb2web/)

## About

Ipynb2web is designed to convert Interactive Python Notebooks (.ipynb) into clean, web-ready, static assets that are template-compatible. This standalone tool uses `marked` as it's only dependency and offers unique functionalities not found in other tools like Pandoc, Sphinx, Nbdev, Quarto, etc.

Complete with [API documentation](https://ipynb2web.com/jsdocs/module-Ipynb2web_browser.html), this project facilitates seamless integration of .ipynb documents into web formats.

## Core Features

1. Inclusion of `yaml` metadata at the top of notebooks for processing instructions in the final json output.
2. Use of special `#flags` to control output formatting for individual notebook cells.
3. Option to add minimally opinionated, pre-formatted content through specific `markup`.

## Capabilities

1. Converts .ipynb documents into web-templatable json assets with a single command.
2. Enables rendering of assets on the server or browser using Modules, Vanilla JS, or terminal commands.
3. Supports custom template creation and integration with existing tools.
4. Automates handling of intricate details overlooked by other notebook conversion tools, such as removing system logs, warnings, and error messages.
5. On the server side, it can traverse directories to create python modules, tables of contents, sitemaps, cover photos, and audio transcriptions.

## Development Notes

### Compiling 
1. Running `Build` will link/relink the repo to your global npm registry. do not forget to `Publish` to NPM.
2. The node module does not get minified but served directly from source. `BuildESM` is not used for prod. 

### JSDocs & Docusaurus

This project uses a sophisticated dual-documentation system combining JSDoc for API documentation and Docusaurus for the main documentation site.

1. Use `watchdocs` and `watchdocu` in dev.
2. Running `docs` will compile Docusaurus and the JSDocs from source code comments


#### JSDoc Workflow
1. **Source Scanning**: JSDoc parses all source files in `/src/` for documentation comments
2. **Template Processing**: Uses custom templates from `/jsdocs/tmpl/` to generate HTML
3. **Static Asset Generation**: Outputs documentation to `/docusaurus/static/jsdocs/`
4. **Integration**: Generated docs become part of the Docusaurus static site

#### Docusaurus Workflow
1. **Content Preparation**: Copies README.md to `/docusaurus/docs/overview/getting-started.md`
2. **Site Building**: Generates static site from Docusaurus configuration
3. **Output**: Copies built site to `/docs/` for GitHub Pages deployment
4. **CNAME Setup**: Includes custom domain configuration


##### Others
https://jupyterbook.org/en/stable/reference/cheatsheet.html
https://sphinx-design.readthedocs.io/en/latest/
https://quarto.org/docs/authoring/markdown-basics.html
https://myst-nb.readthedocs.io/en/latest/
https://www.sphinx-doc.org/en/master/usage/restructuredtext/index.html




Comparison of syntax extensions in Markdown flavors:
https://gist.github.com/vimtaai/99f8c89e7d3d02a362117284684baa0f
https://www.markdownguide.org/extended-syntax/
https://docutils.sourceforge.io/rst.html

Markdown and reStructuredText are both markup languages. "Markdown’s extensibility depends on dialects (GitHub Flavored Markdown, CommonMark, etc.). reST has a directive system built in, enabling complex semantic markup, custom roles, and rich extensions without changing core syntax. reST has a broader and stricter syntax with more rules for indentation and directives. It can represent more complex structures like citations, footnotes, and nested constructs but requires more discipline to write. Markdown dominates in general documentation, README files, wikis, and blogs. Editors, renderers, and converters are ubiquitous. reST is tightly integrated with the Python community, especially Sphinx, for technical documentation and API docs generation. reST via Sphinx can produce more complex multi-page sites with indexes, glossaries, and search. Use Markdown for simple, widely compatible docs and quick writing. Use reST for technical documentation that needs heavy cross-referencing, indexing, or Sphinx integration." - chatgpts

"[reStructuredText], a markup language... to write documents. This is similar to markdown, though is less-popular and more flexible." - Jupyterbooks.org

"Docutils is an open-source text processing system for processing plaintext documentation into useful formats, such as HTML, LaTeX, man-pages, OpenDocument, or XML. It includes reStructuredText, the easy to read, easy to use, what-you-see-is-what-you-get plaintext markup language." - DocUtils.sourceforge.io

"Sphinx is an open-source documentation engine that has been popular in the Python community for nearly a decade. Sphinx is based on the Docutils core Python package, which provides a data structure for documents in Python. Sphinx primarily uses...  reStructuredText to write documents." - jupyterbooks.org

"Jupyter Book utilizes Sphinx heavily under the hood. In fact, Jupyter Book [but] uses MyST Markdown, which was created to provide the flexibility of rST but for people who wish to write markdown." - jupyterbook.org

https://myst-parser.readthedocs.io/en/latest/syntax/admonitions.html
vs
https://docutils.sourceforge.io/docs/ref/rst/directives.html


https://www.sphinx-doc.org/en/master/usage/restructuredtext/index.html

Pandoc - Supports divs :::, spans [text]{.class}, footnotes ^[inline]

https://quarto.org/docs/authoring/markdown-basics.html

Quarto - {{< callout-note >}}, {{< include >}}

docusaurus - :::info, :::warning blocks

https://jupyterbook.org/en/stable/reference/cheatsheet.html