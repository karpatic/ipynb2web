// Build ESM for node. 
// Since ESM dependencies use CJS modules underneath this frequently breaks.
// Better to just use the UMD version or the original ESM files in ./src directly.

import * as esbuild from 'esbuild';
esbuild.build({
  entryPoints: ['src/main.js'],
  outfile: 'dist/ipynb2web.node.mjs',
  bundle: true,
  minify: false,
  platform: 'node',
  format: 'esm',
}).catch(() => process.exit(1));
