/** 
 *  @fileOverview Entry point for Browser version of ipynb2web
 *
 *  @author       Charles Karpati
 */

import * as Convert from './convert.mjs';

const ipynb2web = {
  nb2json: Convert.nb2json
};

if (typeof window !== 'undefined') {
  window.ipynb2web = ipynb2web;
}

export default ipynb2web;