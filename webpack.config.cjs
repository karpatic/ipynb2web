const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');


//
// Idealy: Build using ESM for ease and package UMD for compatibility. Depending on the project, you made need two: One for node and one for browser. 
//
/*
| Module Type                         | File Extension     | Export                  | Import/Require    | Supported Environments       | Compatible with                            |
|-------------------------------------|--------------------|-------------------------|-------------------|------------------------------|--------------------------------------------|
| CommonJS (CJS)                      | .js/.cjs           | module.exports          | require           | Node.js                      | CJS, UMD, ESM (with async import)          |
| ES Module (ESM)                     | .js/.mjs           | export                  | import            | Browser + Node.js            | ESM, UMD, CJS (with import)                |
| Universal Module Definition (UMD)   | .js                | Universal pattern       | require/amd define| Browser + Node.js            | UMD, ESM, CJS, AMD                         |
| Asynchronous Module Definition (AMD)| .js                | define                  | require           | Browser                      | AMD, UMD                                   |
| Traditional Browser Scripts         | .js                | N/A                     | N/A               | Browser                      | AMD, UMD, ESM (all indirectly)             |
*/

//
// The Node ESM build script is located in ./esbuild.js but its not really needed.
// Since ESM dependencies use CJS modules underneath the esm build for node frequently breaks.
// Better to just use the original ESM files in ./src directly for that reason. Not even the UMD version works escape this issue.
//

const commonConfig = {
    optimization: {
        splitChunks: false,
        minimize: false
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { modules: false }] // Do not transform modules
                        ]
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.mjs'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    }
};

// cjs  - Not Needed
const nodeCommonConfig = {
    ...commonConfig,
    mode: 'production',
    target: 'node',
    entry: { 'node': './src/node.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ipynb2web.cjs',
        libraryTarget: 'commonjs2',
        globalObject: 'this'
    },
    externals: [nodeExternals()]
};

// cjs.min - Not Needed
const nodeCommonConfigMinified = {
    ...nodeCommonConfig,
    output: {
        ...nodeCommonConfig.output,
        filename: 'ipynb2web.min.cjs',
    },
    optimization: {
        ...commonConfig.optimization,
        minimize: true
    },
};

// cli cjs
const cliConfig = {
    ...commonConfig,
    mode: 'production',
    target: 'node',
    entry: { 'cli': './src/cli.js' },
    output: {
        path: path.resolve(__dirname, 'bin'),
        filename: 'ipynb2web.[name].cjs',
        libraryTarget: 'commonjs2',
        globalObject: 'this'
    },
    externals: [nodeExternals()],
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node',
            raw: true
        })
    ]
};

// cli.min cjs
const cliConfigMinified = {
    ...cliConfig,
    output: {
        ...cliConfig.output,
        filename: 'ipynb2web.[name].min.cjs',
    },
    optimization: {
        ...commonConfig.optimization,
        minimize: true
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node',
            raw: true
        })
    ]
};

/*
// node umd
const nodeUmdConfig = {
    ...commonConfig,
    mode: 'production',
    target: 'web',
    entry: { 'node': './src/node.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ipynb2web.[name].umd.js',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    externals: [nodeExternals()]
};
*/

// browser umd
const browserConfig = {
    ...commonConfig,
    mode: 'production',
    target: 'web',
    entry: { 'browser': './src/browser.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ipynb2web.[name].umd.js',
        libraryTarget: 'umd',
        globalObject: 'this'
    }
};

// min.browser umd
const browserConfigMinified = {
    ...browserConfig,
    output: {
        ...browserConfig.output,
        filename: 'ipynb2web.[name].umd.min.js',
    },
    optimization: {
        ...commonConfig.optimization,
        minimize: true
    },
};

// browser esm - Not Needed
const browserESMConfig = {
    ...commonConfig,
    mode: 'production',
    target: 'browserslist:defaults',
    entry: { 'browser': './src/browser.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ipynb2web.[name].mjs',
        library: { type: 'module' },
        chunkFormat: 'module'
    },
    experiments: {
        outputModule: true
    }
};

// min.browser esm - Not Needed
const browserESMConfigMinified = {
    ...browserESMConfig,
    output: {
        ...browserESMConfig.output,
        filename: 'ipynb2web.[name].min.mjs',
    },
    optimization: {
        ...commonConfig.optimization,
        minimize: true
    },
};

module.exports = [
    nodeCommonConfig, nodeCommonConfigMinified,
    cliConfig, cliConfigMinified,
    // nodeUmdConfig, nodeUmdConfigMinified,
    browserConfig, browserConfigMinified,
    browserESMConfig, browserESMConfigMinified
];