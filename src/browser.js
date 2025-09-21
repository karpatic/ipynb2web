/**
 * @fileOverview Entry point for Browser version of ipynb2web.
 * @module Ipynb2web:browser
 * @description The entry point for the __Browser__ version of ipynb2web.
 * 
 * Import: Script Tag
 * ```
 * <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
 * <script src="https://cdn.jsdelivr.net/npm/npm/ipynb2web@latest/dist/ipynb2web.browser-umd.js"></script>
 * ```
 *  Import: As Module
 * ```
 * import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"; 
 * import ipynb2web from 'https://cdn.jsdelivr.net/npm/ipynb2web@latest/dist/ipynb2web.browser.mjs';
 * ``` 
 * Usage:
 * ``` 
 * const prepairedJsonAsset = ipynb2web.nb2json(url)
 * ```
 * Returns:
 * ```
 * { meta: { ... }, content: { ... } } 
 * ```
 * When ipynb2web is used in the browser environment, it assigns the 'ipynb2web' object to the global 'window' object.
 * 
 * It exposes the [nb2json](module-convert.html#.nb2json) function and nothing more.
 * @exports {Object} ipynb2web - An object containing the 'nb2json' function.
 * @exports {Function} nb2json - A function to convert Jupyter Notebook to JSON.
 * @author Charles Karpati
 */

import * as Convert from './convert.mjs';

/**
 * ipynb2web's Browser implementation. This is not the same as the Node or the CLI implementation.
 * @type {Object}
 * @property {Function} nb2json - Calls [convert.nb2json](module-convert.html#.nb2json) to convert Jupyter Notebook to JSON.
 * @memberof module:Ipynb2web:browser
 */
const ipynb2web = {
  nb2json: Convert.nb2json
};

/**
 * If the script is running in a browser environment, assign the 'ipynb2web' object to the global 'window' object.
 */
if (typeof window !== 'undefined') {
  window.ipynb2web = ipynb2web; 
}

export default ipynb2web;
  