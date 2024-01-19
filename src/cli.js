#!/usr/bin/env node

/** 
 *  @fileOverview Entry point for Cli version of ipynb2web
 *
 *  @author       Charles Karpati
 */

import { createAudio, createSitemap, cli_nbs2html } from './prerender.mjs';

/**
 * Command line interface function that processes given arguments and calls the appropriate function based on the first argument.
 *
 * @param {string[]} args - An array of command line arguments.
 * - args[0]: The command to execute ('sitemap', 'audio', or the directory for 'cli_nbs2html').
 * - args[1]: The 'SAVETO' directory path, used as a target directory for saving files.
 * - args[2]: The 'FROM' directory path, used as a source directory for processing files.
 * - args[3]: The file path for saving the sitemap (used only when args[0] is 'sitemap').
 */
function cli(args) {
    const directory = args[0] || '';
    const SAVETO = args[1] || false;
    const FROM = args[2] || false;
    const sitemapFile = args[2] || false;

    console.log('CLI RECIEVED: ', { args, directory });

    if (directory === 'sitemap') { createSitemap(SAVETO, sitemapFile); }
    else if (directory === 'audio') { createAudio(FROM, SAVETO); }
    else { cli_nbs2html(FROM, directory, SAVETO); }
}

if (require.main === module) {
    const args = process.argv.slice(2);
    cli(args);
}

export default cli;