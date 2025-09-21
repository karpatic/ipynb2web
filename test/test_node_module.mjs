// test.js
// import { ipynb2web } from './../src/node.js';
// or
// import ipynb2web from './../src/node.js';
import ipynb2web from 'ipynb2web';

console.log(ipynb2web);
// import { Convert } from './../src/main.js';
const directory = '';
const SAVETO = './src/posts/';
const FROM = './src/ipynb/';
const sitemapFile = './sitemap.txt';

async function testConvert() {
    console.log('Testing convert...');
    let test = await ipynb2web.nb2json("https://raw.githubusercontent.com/karpatic/karpatic/refs/heads/main/src/ipynb/labs/01_nb_2_html_tests.ipynb");
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
