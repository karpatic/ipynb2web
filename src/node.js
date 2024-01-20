#!/usr/bin/env node

/**
 * @description The entry point for the __Node__ version of ipynb2web when installed via NPM.
 * 
 * Install:
 * ```
 * npm install ipynb2web
 * ```
 * Import using ESM:
 * ```
 * // import { ipynb2web } from './../src/node.js';
 * // or
 * import ipynb2web from './../src/node.js';
 * ```
 * Import using CJS:
 * ```
 * // const ipynb2web = require('../dist/ipynb2web.cjs').default;
 * // or
 * const { ipynb2web } = require('../dist/ipynb2web.cjs');
 * ```
 * Usage:
 * ```
 * const prepairedJsonAsset = ipynb2web.nb2json(url)
 * ```
 * Returns:
 * ```
 * { meta: { ... }, content: { ... } }
 * ```
 * 
 * It exposes core functionalities from the [convert](module-convert.html), [prerender](module-prerender.html), [convert_util](module-convert_util.html) modules. 
 * @module node
 * @exports {Object} ipynb2web - An object containing the 'nb2json' function.
 * @exports {Function} nb2json - A function to convert Jupyter Notebook to JSON.
 * @author Charles Karpati
 */

import * as Prerender from './prerender.mjs';
import * as CreateAudio from './create_audio.mjs';
import * as ConvertUtils from './convert_util.mjs';
import * as Convert from './convert.mjs';

/**
 * @type {Object} ipynb2web's Node implementation. This is not the same as the browser or the CLI implementation.
 * @property {Function} createSitemap - Function to create a sitemap.
 * @property {Function} createAudio - Function to create audio.
 * @property {Function} cli_nbs2html - Function to convert notebooks to HTML from command line.
 * @property {Function} createSpeech - Function to create speech.
 * @property {Function} saveSpeech - Function to save speech.
 * @property {Function} getTextFromJson - Function to get text from JSON.
 * @property {Function} speechFromDir - Function to create speech from directory.
 * @property {Function} makeDetails - Function to make details.
 * @property {Function} replaceEmojis - Function to replace emojis.
 * @property {Function} convertNotes - Function to convert notes.
 * @property {Function} replaceAndLog - Function to replace and log.
 * @property {Function} nb2json - Function to convert Jupyter Notebook to JSON.
 */
const ipynb2web = {
  createSitemap: Prerender.createSitemap,
  createAudio: Prerender.createAudio,
  cli_nbs2html: Prerender.cli_nbs2html,
  createSpeech: CreateAudio.createSpeech,
  saveSpeech: CreateAudio.saveSpeech,
  getTextFromJson: CreateAudio.getTextFromJson,
  speechFromDir: CreateAudio.speechFromDir,
  makeDetails: ConvertUtils.makeDetails,
  replaceEmojis: ConvertUtils.replaceEmojis,
  convertNotes: ConvertUtils.convertNotes,
  replaceAndLog: ConvertUtils.replaceAndLog,
  nb2json: Convert.nb2json
};

export default ipynb2web;

export { ipynb2web };