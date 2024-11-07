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
 * import ipynb2web from 'ipynb2web';
 * ```
 * Import using CJS:
 * ```
 * // const ipynb2web = require('ipynb2web').default;
 * // or
 * const { ipynb2web } = require('ipynb2web');
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
 * Calls core functionalities from the [convert](module-convert.html), [prerender](module-prerender.html), [convert_util](module-convert_util.html) modules. 
 * @module Ipynb2web:node
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
 * @property {Function} createSitemap - Calls [prerender.createSitemap](module-prerender.html#.createSitemap) to create a sitemap.
 * @property {Function} createAudio - Calls [prerender.createAudio](module-prerender.html#.createAudio) to create audio.
 * @property {Function} cli_nbs2html - Calls [prerender.cli_nbs2html](module-prerender.html#.cli_nbs2html) to convert notebooks to HTML from command line.
 * @property {Function} createSpeech - Calls [create_audio.createSpeech](module-create_audio.html#.createSpeech) to create speech.
 * @property {Function} saveSpeech - Calls [create_audio.saveSpeech](module-create_audio.html#.saveSpeech) to save speech.
 * @property {Function} getTextFromJson - Calls [create_audio.getTextFromJson](module-create_audio.html#.getTextFromJson) to get text from JSON.
 * @property {Function} speechFromDir - Calls [create_audio.speechFromDir](module-create_audio.html#.speechFromDir) to create speech from a directory.
 * @property {Function} makeDetails - Calls [convert_util.makeDetails](module-convert_util.html#.makeDetails) to make details.
 * @property {Function} replaceEmojis - Calls [convert_util.replaceEmojis](module-convert_util.html#.replaceEmojis) to replace emojis.
 * @property {Function} convertNotes - Calls [convert_util.convertNotes](module-convert_util.html#.convertNotes) to convert notes.
 * @property {Function} replaceAndLog - Calls [convert_util.replaceAndLog](module-convert_util.html#.replaceAndLog) to replace and log.
 * @property {Function} nb2json - Calls [convert.nb2json](module-convert.html#.nb2json) to convert Jupyter Notebook to JSON.
 * @memberof module:Ipynb2web:node
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