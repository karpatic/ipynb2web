// Focused converter regressions. Author: Codex app agent, 2026-09-11.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import ipynb2web from '../src/node.js';

const markdown = source => ({ cell_type: 'markdown', source });
const code = (source, outputs = []) => ({ cell_type: 'code', source, outputs });
const data = bundle => ({ output_type: 'display_data', data: bundle });
const render = (cells, options) => ipynb2web.renderNotebook({ cells }, options);
const html = (cells, options) => render(cells, options).content;

const meta = render([markdown('---\ntitle: "A: title"\nkeywords: [one, two]\nhide: false\ncount: 2\nhost:\n  routes:\n    - /a\n    - /b\n__proto__:\n  polluted: true\nconstructor: safe\n---\nBody')]);
assert.deepEqual(meta.meta.keywords, ['one', 'two']);
assert.equal(meta.meta.hide, false);
assert.equal(meta.meta.count, 2);
assert.equal(meta.meta.host.routes[1], '/b');
assert.equal(meta.meta.__proto__.polluted, true);
assert.equal(meta.meta.constructor, 'safe');
assert.equal({}.polluted, undefined);
assert.equal(Object.getPrototypeOf(meta.meta), null);
assert.match(meta.content, /<p>Body<\/p>/);
for (const yaml of ['---\nlist: [oops\n---', '---\na: 1', '---\n- not a mapping\n---', '---\na: 1\na: 2\n---', '---\na: &a [1]\nb: *a\n---']) {
  assert.throws(() => render([markdown(yaml)]), /YAML frontmatter \(cell 1\)/);
}
const old = render([markdown(['# Legacy\n', '> Summary\n', '- keywords: [a, b]\n', '- hide: false\n', '- title2: "false"'])]);
assert.deepEqual(old.meta.keywords, ['a', 'b']);
assert.equal(old.meta.hide, false);
assert.equal(old.meta.title2, 'false');
assert.match(html([markdown('# Ordinary heading\n\nContent')]), /Ordinary heading/);
assert.match(html([markdown('# Heading only')]), /<h1>/);
assert.match(html([code('first_cell()')]), /first_cell\(\)/);
assert.equal(html([]), '');

const blocks = html([markdown(':::: {#outer .callout-note title="Two words" data-x="a & b"}\nBefore\n\n::: {.tip}\n- one\n- two\n:::\n\n```text\n::: {.literal}\n::: \n```\n\nAfter\n::::\n\nOutside')]);
assert.match(blocks, /<div id="outer" class="callout-note" title="Two words" data-x="a &amp; b">/);
assert.match(blocks, /<div class="tip">\n<ul>/);
assert.match(blocks, /<pre><code class="language-text">::: \{.literal\}/);
assert.match(blocks, /<\/div>\n<p>Outside/);
assert.doesNotMatch(blocks, /<p>\s*<div/);
assert.match(html([markdown('::: {.a}\n::: {.b}\nB\n:::\nA\n:::')]), /<\/div>\n<p>A/);
assert.match(html([markdown('> ::: {.quote}\n> quoted\n> :::')]), /<blockquote>\n<div class="quote">/);
assert.match(html([markdown('[a **bold** [nested]{.inside}]{.span #sp title="quoted value"} `^[literal]`')]), /<span class="span" id="sp" title="quoted value">a <strong>bold<\/strong> <span class="inside">nested<\/span>/);
assert.match(html([markdown('^[inline] and [^ref]\n\n[^ref]: referenced')]), /id="fn-cell-1-2"/);
assert.match(html([markdown('^[one]'), markdown('^[two]')]), /id="fn-cell-2-1"/);
assert.match(html([markdown('^[note]{.tip #note title="Note title"}')]), /<span class="tip" id="note" title="Note title"><sup/);
assert.match(html([markdown('<pre>\n::: {.literal}\n::: \n</pre>')], { trusted: true }), /<pre>\n::: \{.literal\}/);
assert.equal(render([markdown('::: {.a}\nopen')]).diagnostics[0].code, 'unclosed-div');
for (const trusted of [false, true]) {
  assert.doesNotMatch(html([markdown('<code>^[literal] [text]{.literal}</code>')], { trusted }), /footnote|<span/);
  assert.doesNotMatch(html([markdown('<pre>\n::: {.literal}\ntext\n::: \n</pre>')], { trusted }), /<div/);
}

for (const flag of ['', '#collapse_input\n', '#collapse_input_open\n', '#| code-fold: true\n', '#| code-fold: show\n']) {
  const result = html([code(`${flag}print("<tag>")`)]);
  assert.match(result, /print\(&quot;&lt;tag&gt;&quot;\)/);
  if (flag) assert.match(result, /<details/);
  if (/open|show/.test(flag)) assert.match(result, / open>/);
  else assert.doesNotMatch(result, / open>/);
}
assert.equal(html([code('#| echo:false\n#| output:false\nrun()', [{ output_type: 'stream', text: 'out' }])]), '');
const output = { output_type: 'stream', name: 'stdout', text: ['<unsafe>\n', 'next'] };
assert.equal(html([code('#| include: false\n#| echo: true\nrun()', [output])]), '');
assert.doesNotMatch(html([code('#hide_input\n#hide_output\nrun()', [output])]), /run|unsafe/);
assert.match(html([code('#| echo: true\n#hide_input\nrun()')]), /run/);
assert.match(html([code('#| echo: false\n#| echo: true\nrun()')]), /run/);
assert.doesNotMatch(html([code('#| echo: false\n#| output-fold: show\nrun()', [output])]), /run/);
assert.match(html([code('#| echo: false\n#| output-fold: show\nrun()', [output])]), /data-cell-type='output' open/);
assert.match(html([code('text = "#hide"\n#hide_input\nbody()')]), /#hide_input/);
assert.match(html([code('\n#| echo: false\nbody()')]), /body/);
assert.equal(render([code('#| echo: nope\nbody()')]).diagnostics[0].code, 'invalid-option');
assert.match(html([code('%%javascript\nwindow.notExecuted = true')]), /%%javascript/);
assert.equal(render([code('%%javascript\nwindow.notExecuted = true')]).diagnostics[0].code, 'unexecuted-magic');

const svg = '<svg xmlns="http://www.w3.org/2000/svg"><text>x</text></svg>';
assert.match(html([code('', [output])]), /&lt;unsafe&gt;\nnext/);
assert.match(html([code('', [data({ 'text/plain': '<Figure 1>' })])]), /&lt;Figure 1&gt;/);
assert.match(html([code('', [data({ 'text/plain': 'fallback', 'image/png': ['YQ=='] })])]), /data:image\/png;base64,YQ==/);
assert.match(html([code('', [data({ 'image/svg+xml': [svg], 'text/plain': 'fallback' })])]), /data:image\/svg\+xml,%3Csvg/);
assert.match(html([code('', [data({ 'image/png': '', 'text/plain': 'fallback' })])]), /fallback/);
assert.match(html([code('', [{ output_type: 'error', ename: 'Oops', evalue: '<bad>' }])]), /Oops: &lt;bad&gt;/);
assert.equal(render([code('', [{ output_type: 'display_data' }])]).diagnostics[0].code, 'unsupported-output');
assert.equal(render([code('', [data({ 'application/unknown': 'x' })])]).diagnostics[0].code, 'unsupported-output');
const attachment = { ...markdown('![plot](attachment:plot.svg)'), attachments: { 'plot.svg': { 'image/svg+xml': svg } } };
assert.match(html([attachment]), /data:image\/svg\+xml,/);
assert.equal(render([markdown('![x](attachment:missing)')]).diagnostics[0].code, 'missing-attachment');
const rich = [code('', [data({ 'text/html': '<b>rich</b>', 'text/plain': 'fallback' })])];
assert.match(html(rich), /fallback/);
assert.match(html(rich, { trusted: true }), /<b>rich<\/b>/);
assert.doesNotMatch(html([markdown('---\ntrusted: true\nprettify: true\n---\n<img src=x onerror=alert(1)>')]), /<img|<script/);
assert.doesNotMatch(html([markdown('[x]{onclick="alert(1)"} [bad](javascript:alert(1))')]), /<[^>]+(?:onclick|href="javascript:)/);
assert.match(html([markdown('[x]{onclick="alert(1)"}')], { trusted: true }), /onclick=/);
assert.match(html([markdown('🙂 [link](https://example.com)')]), /🙂/);
assert.doesNotMatch(html([markdown('[link](https://example.com)')]), /target=|nofollow/);
assert.match(html([markdown('[link](https://example.com)')], { externalLinks: 'new-tab' }), /rel="noopener noreferrer"/);
const extracted = render([code('', [data({ 'text/html': '<b>one</b>' }), data({ 'text/html': '<b>two</b>' }), data({ 'application/javascript': 'window.x = "</script>";' }), data({ 'image/svg+xml': svg })])], { trusted: true, extractAssets: true });
assert.equal(extracted.assets.length, 4);
assert.equal(new Set(extracted.assets.map(a => a.placeholderName)).size, 4);
assert.equal(extracted.assets[3].encoding, 'utf8');
assert.match(extracted.content, /ASSET_PLACEHOLDER_/);
assert.match(html([code('', [data({ 'application/javascript': 'window.x = "</script>";' })])], { trusted: true }), /src="data:text\/javascript,/);

const server = createServer((req, res) => {
  if (req.url === '/missing') { res.writeHead(404).end('missing'); return; }
  const send = () => res.end(JSON.stringify({ cells: [markdown(`---\ntitle: ${req.url}\n---`), attachment] }));
  if (req.url === '/slow') setTimeout(send, 30); else send();
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
try {
  const url = `http://127.0.0.1:${server.address().port}`;
  const results = await Promise.all(['/slow', '/fast'].map(path => ipynb2web.nb2json(url + path, { extractAssets: true })));
  assert.deepEqual(results.map(r => r.meta.title), ['/slow', '/fast']);
  assert.ok(results.every(r => r.assets.length === 1));
  assert.notEqual(results[0].assets[0].placeholderName, results[1].assets[0].placeholderName);
  await assert.rejects(ipynb2web.nb2json(url + '/missing'), /404/);
} finally { server.close(); }

const sample = JSON.parse(await readFile(new URL('../docusaurus/static/test/sample-notebook.ipynb', import.meta.url), 'utf8'));
assert.ok(ipynb2web.renderNotebook(sample).content.length > 100);
console.log('Converter checks passed: metadata, Markdown structure, options, MIME/assets, trust, concurrent fetches.');
