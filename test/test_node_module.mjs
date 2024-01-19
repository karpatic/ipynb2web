// test.js
// import { Prerender } from './../dist/ipynb2web.main.mjs';
import ipynb2web from './../dist/ipynb2web.main.mjs';

console.log({ ipynb2web });
// import { Convert } from './../src/main.js';
const directory = '';
const SAVETO = './src/client/posts/';
const FROM = './src/ipynb/';
const sitemapFile = './sitemap.txt';

async function testConvert() {
    console.log('Testing convert...');
    let test = await ipynb2web.nb2json("https://api.charleskarpati.com/vanillapivottable/index.ipynb");
    console.log({ test });
    console.log('convert test completed.\n');
}

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
    await testConvert();
    /*
    await testCliNbs2Html();
    await testCreateSitemap();
    await testCreateAudio();
    console.log('All tests completed.');
    */
}

runTests();
