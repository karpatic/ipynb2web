#!/usr/bin/env node

/**
 * @description The entry point for the __CLI__ version of ipynb2web. 
 * 
 * Install:
 * ```
 * npm install ipynb2web
 * ``` 
 * Usage: 
 * ```
 * ipynb2web <COMMAND> <SAVETO> <FROM/or/SitemapName>
 * ```
 * 
 * Get help: 
 * ```
 * ipynb2web help
 * ```
 * 
 * It provides a command line interface function that processes given arguments and calls [createSitemap](module-prerender.html#.createSitemap), 
 * [createAudio](module-prerender.html#.createAudio), or [cli_nbs2html](module-prerender.html#.cli_nbs2html), based on the first argument.
 * @module cli
 * @exports cli
 * @author Charles Karpati
 */

import { createAudio, createSitemap, cli_nbs2html } from './prerender.mjs';


/**
 * Displays documentation on how to use the CLI when 'help' argument is provided.
 */
function help() {
    console.log(`Usage: ipynb2web <COMMAND> <SAVETO> <FROM/or/SitemapName>
    
Commands:
  sitemap      Create a sitemap.
  audio        Create audio assets.
  help         Display this help message.
`);
}

/**
 * Command line interface function that processes given arguments and calls the appropriate function based on the first argument.
 *
 * @param {string[]} args - An array of command line arguments.
 * - args[0]: 'Command' - Enter ['sitemap', 'audio'] to create these assets. If neither, it will the value be appended to the SAVETO and FROM paths for processing nb2json on.
 * - args[1]: 'SAVETO' - This directory path, used as a target directory for saving files.
 * - args[2]: 'FROM' - This directory path, used as an output directory for processing files (Whenever args[0] is NOT 'sitemap').
 * - args[2]: 'sitemapFile' - The file path for saving the sitemap (ONLY when args[0] is 'sitemap').
 */
function cli(args) {
    const directory = args[0] || '';
    const SAVETO = args[1] || false;
    const FROM = args[2] || false;
    const sitemapFile = args[2] || false;

    console.log('CLI RECEIVED: ', { args, directory });

    /**
     * Based on the first argument, call the appropriate function.
     * If 'sitemap', call createSitemap.
     * If 'audio', call createAudio.
     * Otherwise, call cli_nbs2html.
     */
    if (directory === 'sitemap') { createSitemap(SAVETO, sitemapFile); }
    else if (directory === 'audio') { createAudio(FROM, SAVETO); }
    else { cli_nbs2html(FROM, directory, SAVETO); }
}

/**
 * If this module is the main module (i.e., the script being run), call the cli or help function with the command line arguments.
 */
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args[0] === 'help') {
        help();
    } else {
        cli(args);
    }
}

export default cli;
