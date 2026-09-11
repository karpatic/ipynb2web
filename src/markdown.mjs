import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Parse the shared Pandoc attribute list before HTML rendering, including quotes.
function attributes(text) {
  const match = /^\{((?:[^}"']|"[^"]*"|'[^']*')*)\}/.exec(text);
  if (!match) return null;
  const attrs = new Map();
  let rest = match[1].trim();
  while (rest) {
    const item = /^(?:([.#])([^\s{}"'=]+)|([A-Za-z_:][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s{}]+)))?)(?:\s+|$)/.exec(rest);
    if (!item) return null;
    const key = item[1] === '.' ? 'class' : item[1] === '#' ? 'id' : item[3];
    const value = item[1] ? item[2] : item[4] ?? item[5] ?? item[6] ?? '';
    attrs.set(key, key === 'class' && attrs.has(key) ? `${attrs.get(key)} ${value}` : value);
    rest = rest.slice(item[0].length);
  }
  return { length: match[0].length, attrs: [...attrs] };
}

function setAttrs(token, parsed, trusted, diagnose) {
  for (const [key, value] of parsed.attrs) {
    // HTML/URL/style attributes can activate content. Host data/ARIA and ordinary
    // presentation attributes are inert here; host behavior remains host policy.
    if (!trusted && !/^(?:id|class|title|lang|dir|role|tabindex|hidden|width|height|data-[\w.-]+|aria-[\w.-]+)$/i.test(key)) {
      diagnose('unsafe-attribute', `Attribute ${key} requires trusted rendering`);
      continue;
    }
    token.attrSet(key, value);
  }
}

function extensions(md, { trusted, diagnose }) {
  // Tokenize HTML in both modes so literal block boundaries stay intact;
  // untrusted rendering escapes those tokens instead of inserting raw HTML.
  if (!trusted) {
    md.renderer.rules.html_block = (tokens, index) => `<pre>${escapeHtml(tokens[index].content)}</pre>\n`;
    md.renderer.rules.html_inline = (tokens, index) => escapeHtml(tokens[index].content);
  }
  md.inline.ruler.before('html_inline', 'literal_html', (state, silent) => {
    const match = /^<(code|pre|script|style|textarea)(?:\s[^>]*|)>[\s\S]*?<\/\1\s*>/i.exec(state.src.slice(state.pos));
    if (!match) return false;
    if (!silent) {
      const token = state.push(trusted ? 'html_inline' : 'text', '', 0);
      token.content = match[0];
    }
    state.pos += match[0].length;
    return true;
  });
  // Retain attributes on inline notes and allow the same form on references.
  const renderNote = md.renderer.rules.footnote_ref;
  md.renderer.rules.footnote_ref = (tokens, index, opts, env, self) => {
    const note = renderNote(tokens, index, opts, env, self);
    return tokens[index].attrs ? `<span${self.renderAttrs(tokens[index])}>${note}</span>` : note;
  };
  md.inline.ruler.before('text', 'note_attributes', (state, silent) => {
    const previous = state.tokens[state.tokens.length - 1];
    if (state.pending || previous?.type !== 'footnote_ref') return false;
    const parsed = attributes(state.src.slice(state.pos));
    if (!parsed) return false;
    if (!silent) setAttrs(previous, parsed, trusted, diagnose);
    state.pos += parsed.length;
    return true;
  });

  md.inline.ruler.before('link', 'attributed_span', (state, silent) => {
    if (state.src[state.pos] !== '[') return false;
    const start = state.pos;
    const end = md.helpers.parseLinkLabel(state, start, false);
    if (end < 0) return false;
    const parsed = attributes(state.src.slice(end + 1));
    if (!parsed) return false;
    if (!silent) {
      const open = state.push('span_open', 'span', 1);
      setAttrs(open, parsed, trusted, diagnose);
      const oldMax = state.posMax;
      state.pos = start + 1;
      state.posMax = end;
      md.inline.tokenize(state);
      state.posMax = oldMax;
      state.push('span_close', 'span', -1);
    }
    state.pos = end + 1 + parsed.length;
    return true;
  });

  md.block.ruler.before('fence', 'fenced_div', (state, start, end, silent) => {
    const lineText = line => state.src.slice(state.bMarks[line] + state.tShift[line], state.eMarks[line]);
    if (state.sCount[start] - state.blkIndent >= 4) return false;
    const opening = /^(:{3,})\s*(.+?)\s*$/.exec(lineText(start));
    if (!opening) return false;
    const info = opening[2];
    const parsed = attributes(info) ?? (/^[\w-]+$/.test(info) ? { attrs: [['class', info]], length: info.length } : null);
    if (!parsed || parsed.length !== info.length) return false;
    if (silent) return true;

    // Let the block parser find the close: fenced code, raw HTML, lists and
    // nested divs consume their own lines, so literal colons cannot close a div.
    const oldParent = state.parentType;
    const oldLineMax = state.lineMax;
    const oldClose = state.env.ipynbDivClose;
    state.parentType = 'ipynb_div';
    state.env.ipynbDivClose = { indent: state.blkIndent, end: null };
    const close = state.env.ipynbDivClose;
    const token = state.push('div_open', 'div', 1);
    token.block = true;
    setAttrs(token, parsed, trusted, diagnose);
    state.md.block.tokenize(state, start + 1, end);
    state.parentType = oldParent;
    state.lineMax = oldLineMax;
    state.env.ipynbDivClose = oldClose;
    const closing = state.push('div_close', 'div', -1);
    closing.block = true;
    state.line = close.end === null ? state.line : close.end + 1;
    if (close.end === null) diagnose('unclosed-div', `Fenced div at Markdown line ${start + 1} has no closing fence`);
    return true;
  }, { alt: ['paragraph', 'reference', 'blockquote', 'list'] });

  md.block.ruler.before('fenced_div', 'div_close_marker', (state, start, end, silent) => {
    const close = state.env.ipynbDivClose;
    if (!close || (!silent && state.parentType !== 'ipynb_div') || state.sCount[start] !== close.indent) return false;
    const line = state.src.slice(state.bMarks[start] + state.tShift[start], state.eMarks[start]);
    if (!/^:{3,}\s*$/.test(line)) return false;
    if (silent) return true;
    close.end = start;
    state.line = end; // End this recursive block tokenization only.
    return true;
  }, { alt: ['paragraph', 'reference', 'blockquote', 'list'] });
}

export function createMarkdown(options, diagnose, image) {
  const md = new MarkdownIt({ html: true, linkify: false, typographer: false });
  md.use(footnote).use(extensions, { trusted: options.trusted === true, diagnose });
  const renderImage = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, index, opts, env, self) => {
    const token = tokens[index];
    const src = token.attrGet('src');
    if (src?.startsWith('attachment:')) {
      let name = src.slice(11);
      try { name = decodeURIComponent(name); } catch { /* Report as missing below. */ }
      const bundle = Object.hasOwn(env.attachments ?? {}, name) ? env.attachments[name] : null;
      const url = image(bundle);
      if (!url) {
        diagnose('missing-attachment', `Missing or unsupported attachment: ${name}`);
        return `<span class="ipynb-diagnostic">[Attachment: ${escapeHtml(name)}]</span>`;
      }
      token.attrSet('src', url);
    }
    return renderImage(tokens, index, opts, env, self);
  };
  if (options.externalLinks === 'new-tab') {
    md.renderer.rules.link_open = (tokens, index, opts, env, self) => {
      if (/^https?:\/\//i.test(tokens[index].attrGet('href') ?? '')) {
        tokens[index].attrSet('target', '_blank');
        tokens[index].attrSet('rel', 'noopener noreferrer');
      }
      return self.renderToken(tokens, index, opts);
    };
  }
  return md;
}
