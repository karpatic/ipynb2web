#!/usr/bin/env node

/** 
 *  @fileOverview Node.js entry point for ipynb2web
 *
 *  @author       Charles Karpati
 */

import * as Prerender from './prerender.mjs';
import * as CreateAudio from './create_audio.mjs';
import * as ConvertUtils from './convert_util.mjs';
import * as Convert from './convert.mjs';

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