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