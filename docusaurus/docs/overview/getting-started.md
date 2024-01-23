# Getting Started

[![npm version](https://badge.fury.io/js/ipynb2web.svg)](https://badge.fury.io/js/ipynb2web)
[![HitCount](https://hits.dwyl.com/karpatic/ipynb2web.svg?style=flat-square)](http://hits.dwyl.com/karpatic/ipynb2web)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/karpatic/ipynb2web/total)
![GitHub repo size](https://img.shields.io/github/repo-size/karpatic/ipynb2web)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM](https://nodei.co/npm/ipynb.png)](https://nodei.co/npm/ipynb/)

## About

Ipynb2web is designed to convert Interactive Python Notebooks (.ipynb) into web-ready, static assets that are template-compatible. This standalone tool uses `marked` as it's only dependency and offers unique functionalities not found in other tools like Pandoc, Sphinx, Nbdev, Quarto, etc.

Complete with [API documentation](https://karpatic.github.io/ipynb2web/jsdocs) and [usage instructions](http://ipynb2web.com/docs/overview/getting-started), this project facilitates seamless integration of .ipynb documents into web formats.

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
