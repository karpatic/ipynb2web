// test.js
// const ipynb2web = require('../dist/ipynb2web.cjs').default;
// or
const { ipynb2web } = require('../dist/ipynb2web.cjs');


console.log(ipynb2web);


const directory = '';
const SAVETO = './src/client/posts/';
const FROM = './src/ipynb/';
const sitemapFile = './sitemap.txt';

async function testCreateAudio() {
    console.log('Testing createAudio...');
    await ipynb2web.createAudio();
    console.log('createAudio test completed.\n');
}

async function testCreateSitemap() {
    console.log('Testing createSitemap...');
    await ipynb2web.createSitemap(SAVETO, sitemapFile);
    console.log('createSitemap test completed.\n');
}

async function testCliNbs2Html() {
    console.log('Testing cli_nbs2html...');

    await ipynb2web.cli_nbs2html(FROM, directory, SAVETO);
    console.log('cli_nbs2html test completed.\n');
}

async function runTests() {
    await testCliNbs2Html();
    await testCreateSitemap();
    await testCreateAudio();
    console.log('All tests completed.');
}

runTests();
