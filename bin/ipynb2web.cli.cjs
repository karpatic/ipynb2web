#!/usr/bin/env node
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 173:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  convertNb: () => (/* binding */ convertNb),
  get_metadata: () => (/* reexport */ get_metadata),
  nb2json: () => (/* binding */ nb2json),
  renderNotebook: () => (/* binding */ renderNotebook)
});

;// external "yaml"
const external_yaml_namespaceObject = require("yaml");
;// ./src/metadata.mjs
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }

var _sourceText = function sourceText(value) {
  return Array.isArray(value) ? value.map(_sourceText).join('') : _typeof(value) === 'object' && value !== null ? JSON.stringify(value) : String(value !== null && value !== void 0 ? value : '');
};

// Maps are converted explicitly so prototype names remain inert own properties.

function parseYaml(text) {
  var doc = (0,external_yaml_namespaceObject.parseDocument)(text, {
    schema: 'core',
    merge: false,
    uniqueKeys: true
  });
  if (doc.errors.length || doc.warnings.length) {
    throw new Error([].concat(_toConsumableArray(doc.errors), _toConsumableArray(doc.warnings)).map(function (e) {
      return e.message;
    }).join('\n'));
  }
  var _normalize = function normalize(value) {
    var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (depth > 100) throw new Error('YAML nesting exceeds 100 levels');
    if (value instanceof Map) {
      var result = Object.create(null);
      var _iterator = _createForOfIteratorHelper(value),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            key = _step$value[0],
            item = _step$value[1];
          if (typeof key !== 'string') throw new Error('Metadata keys must be strings');
          result[key] = _normalize(item, depth + 1);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return result;
    }
    if (Array.isArray(value)) return value.map(function (item) {
      return _normalize(item, depth + 1);
    });
    if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('Metadata numbers must be finite');
    return value;
  };
  return _normalize(doc.toJS({
    mapAsMap: true,
    maxAliasCount: 0
  }));
}
function readMetadata(cell) {
  var _cell$cell_type, _lines$;
  var empty = {
    meta: Object.create(null),
    consumed: false,
    remainder: ''
  };
  if (!cell || !['markdown', 'raw'].includes((_cell$cell_type = cell.cell_type) !== null && _cell$cell_type !== void 0 ? _cell$cell_type : 'markdown')) return empty;
  var text = _sourceText(cell.source).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  var lines = text.split('\n');
  if (((_lines$ = lines[0]) === null || _lines$ === void 0 ? void 0 : _lines$.trim()) === '---') {
    var end = lines.findIndex(function (line, i) {
      return i > 0 && /^(---|\.\.\.)\s*$/.test(line);
    });
    try {
      var _parseYaml;
      if (end < 0) throw new Error('Missing closing --- delimiter');
      var _meta = (_parseYaml = parseYaml(lines.slice(1, end).join('\n'))) !== null && _parseYaml !== void 0 ? _parseYaml : Object.create(null);
      if (_typeof(_meta) !== 'object' || Array.isArray(_meta)) throw new Error('Frontmatter must be a mapping');
      return {
        meta: _meta,
        consumed: true,
        remainder: lines.slice(end + 1).join('\n')
      };
    } catch (error) {
      throw new Error("Invalid notebook YAML frontmatter (cell 1): ".concat(error.message));
    }
  }
  // A heading alone is content. Legacy metadata needs at least one list field,
  // and every nonblank line must belong to the heading/summary/field grammar.
  var nonblank = lines.filter(function (line) {
    return line.trim();
  });
  if (!nonblank.some(function (line) {
    return /^-\s+[^:]+:\s*/.test(line);
  }) || !nonblank.every(function (line) {
    return /^(#{1,6}\s+|>\s?|[-]\s+[^:]+:\s*)/.test(line);
  })) return empty;
  var meta = Object.create(null);
  var _iterator2 = _createForOfIteratorHelper(nonblank),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var line = _step2.value;
      if (line.startsWith('#')) meta.title = line.replace(/^#+\s+/, '');else if (line.startsWith('>')) meta.summary = [meta.summary, line.replace(/^>\s?/, '')].filter(Boolean).join('\n');else {
        var _line$match = line.match(/^-\s+([^:]+):\s*(.*)$/),
          _line$match2 = _slicedToArray(_line$match, 3),
          key = _line$match2[1],
          value = _line$match2[2];
        try {
          meta[key.trim()] = parseYaml(value);
        } catch (_unused) {
          meta[key.trim()] = value;
        } // Legacy prose was never explicit YAML.
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return {
    meta: meta,
    consumed: true,
    remainder: ''
  };
}
function get_metadata(cell) {
  return readMetadata(cell).meta;
}
;// external "markdown-it"
const external_markdown_it_namespaceObject = require("markdown-it");
;// external "markdown-it-footnote"
const external_markdown_it_footnote_namespaceObject = require("markdown-it-footnote");
;// ./src/markdown.mjs
function markdown_slicedToArray(r, e) { return markdown_arrayWithHoles(r) || markdown_iterableToArrayLimit(r, e) || markdown_unsupportedIterableToArray(r, e) || markdown_nonIterableRest(); }
function markdown_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function markdown_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function markdown_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function markdown_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = markdown_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function markdown_toConsumableArray(r) { return markdown_arrayWithoutHoles(r) || markdown_iterableToArray(r) || markdown_unsupportedIterableToArray(r) || markdown_nonIterableSpread(); }
function markdown_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function markdown_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return markdown_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? markdown_arrayLikeToArray(r, a) : void 0; } }
function markdown_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function markdown_arrayWithoutHoles(r) { if (Array.isArray(r)) return markdown_arrayLikeToArray(r); }
function markdown_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }


var escapeHtml = function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (c) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c];
  });
};

// Parse the shared Pandoc attribute list before HTML rendering, including quotes.
function attributes(text) {
  var match = /^\{((?:[^}"']|"[^"]*"|'[^']*')*)\}/.exec(text);
  if (!match) return null;
  var attrs = new Map();
  var rest = match[1].trim();
  while (rest) {
    var _ref, _ref2, _item$;
    var item = /^(?:([.#])([^\s{}"'=]+)|([A-Za-z_:][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s{}]+)))?)(?:\s+|$)/.exec(rest);
    if (!item) return null;
    var key = item[1] === '.' ? 'class' : item[1] === '#' ? 'id' : item[3];
    var value = item[1] ? item[2] : (_ref = (_ref2 = (_item$ = item[4]) !== null && _item$ !== void 0 ? _item$ : item[5]) !== null && _ref2 !== void 0 ? _ref2 : item[6]) !== null && _ref !== void 0 ? _ref : '';
    attrs.set(key, key === 'class' && attrs.has(key) ? "".concat(attrs.get(key), " ").concat(value) : value);
    rest = rest.slice(item[0].length);
  }
  return {
    length: match[0].length,
    attrs: markdown_toConsumableArray(attrs)
  };
}
function setAttrs(token, parsed, trusted, diagnose) {
  var _iterator = markdown_createForOfIteratorHelper(parsed.attrs),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = markdown_slicedToArray(_step.value, 2),
        key = _step$value[0],
        value = _step$value[1];
      // HTML/URL/style attributes can activate content. Host data/ARIA and ordinary
      // presentation attributes are inert here; host behavior remains host policy.
      if (!trusted && !/^(?:id|class|title|lang|dir|role|tabindex|hidden|width|height|data-[\w.-]+|aria-[\w.-]+)$/i.test(key)) {
        diagnose('unsafe-attribute', "Attribute ".concat(key, " requires trusted rendering"));
        continue;
      }
      token.attrSet(key, value);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function extensions(md, _ref3) {
  var trusted = _ref3.trusted,
    diagnose = _ref3.diagnose;
  // Tokenize HTML in both modes so literal block boundaries stay intact;
  // untrusted rendering escapes those tokens instead of inserting raw HTML.
  if (!trusted) {
    md.renderer.rules.html_block = function (tokens, index) {
      return "<pre>".concat(escapeHtml(tokens[index].content), "</pre>\n");
    };
    md.renderer.rules.html_inline = function (tokens, index) {
      return escapeHtml(tokens[index].content);
    };
  }
  md.inline.ruler.before('html_inline', 'literal_html', function (state, silent) {
    var match = /^<(code|pre|script|style|textarea)(?:\s[^>]*|)>[\s\S]*?<\/\1\s*>/i.exec(state.src.slice(state.pos));
    if (!match) return false;
    if (!silent) {
      var token = state.push(trusted ? 'html_inline' : 'text', '', 0);
      token.content = match[0];
    }
    state.pos += match[0].length;
    return true;
  });
  // Retain attributes on inline notes and allow the same form on references.
  var renderNote = md.renderer.rules.footnote_ref;
  md.renderer.rules.footnote_ref = function (tokens, index, opts, env, self) {
    var note = renderNote(tokens, index, opts, env, self);
    return tokens[index].attrs ? "<span".concat(self.renderAttrs(tokens[index]), ">").concat(note, "</span>") : note;
  };
  md.inline.ruler.before('text', 'note_attributes', function (state, silent) {
    var previous = state.tokens[state.tokens.length - 1];
    if (state.pending || (previous === null || previous === void 0 ? void 0 : previous.type) !== 'footnote_ref') return false;
    var parsed = attributes(state.src.slice(state.pos));
    if (!parsed) return false;
    if (!silent) setAttrs(previous, parsed, trusted, diagnose);
    state.pos += parsed.length;
    return true;
  });
  md.inline.ruler.before('link', 'attributed_span', function (state, silent) {
    if (state.src[state.pos] !== '[') return false;
    var start = state.pos;
    var end = md.helpers.parseLinkLabel(state, start, false);
    if (end < 0) return false;
    var parsed = attributes(state.src.slice(end + 1));
    if (!parsed) return false;
    if (!silent) {
      var open = state.push('span_open', 'span', 1);
      setAttrs(open, parsed, trusted, diagnose);
      var oldMax = state.posMax;
      state.pos = start + 1;
      state.posMax = end;
      md.inline.tokenize(state);
      state.posMax = oldMax;
      state.push('span_close', 'span', -1);
    }
    state.pos = end + 1 + parsed.length;
    return true;
  });
  md.block.ruler.before('fence', 'fenced_div', function (state, start, end, silent) {
    var _attributes;
    var lineText = function lineText(line) {
      return state.src.slice(state.bMarks[line] + state.tShift[line], state.eMarks[line]);
    };
    if (state.sCount[start] - state.blkIndent >= 4) return false;
    var opening = /^(:{3,})\s*(.+?)\s*$/.exec(lineText(start));
    if (!opening) return false;
    var info = opening[2];
    var parsed = (_attributes = attributes(info)) !== null && _attributes !== void 0 ? _attributes : /^[\w-]+$/.test(info) ? {
      attrs: [['class', info]],
      length: info.length
    } : null;
    if (!parsed || parsed.length !== info.length) return false;
    if (silent) return true;

    // Let the block parser find the close: fenced code, raw HTML, lists and
    // nested divs consume their own lines, so literal colons cannot close a div.
    var oldParent = state.parentType;
    var oldLineMax = state.lineMax;
    var oldClose = state.env.ipynbDivClose;
    state.parentType = 'ipynb_div';
    state.env.ipynbDivClose = {
      indent: state.blkIndent,
      end: null
    };
    var close = state.env.ipynbDivClose;
    var token = state.push('div_open', 'div', 1);
    token.block = true;
    setAttrs(token, parsed, trusted, diagnose);
    state.md.block.tokenize(state, start + 1, end);
    state.parentType = oldParent;
    state.lineMax = oldLineMax;
    state.env.ipynbDivClose = oldClose;
    var closing = state.push('div_close', 'div', -1);
    closing.block = true;
    state.line = close.end === null ? state.line : close.end + 1;
    if (close.end === null) diagnose('unclosed-div', "Fenced div at Markdown line ".concat(start + 1, " has no closing fence"));
    return true;
  }, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  });
  md.block.ruler.before('fenced_div', 'div_close_marker', function (state, start, end, silent) {
    var close = state.env.ipynbDivClose;
    if (!close || !silent && state.parentType !== 'ipynb_div' || state.sCount[start] !== close.indent) return false;
    var line = state.src.slice(state.bMarks[start] + state.tShift[start], state.eMarks[start]);
    if (!/^:{3,}\s*$/.test(line)) return false;
    if (silent) return true;
    close.end = start;
    state.line = end; // End this recursive block tokenization only.
    return true;
  }, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  });
}
function markdown_createMarkdown(options, diagnose, image) {
  var md = new external_markdown_it_namespaceObject({
    html: true,
    linkify: false,
    typographer: false
  });
  md.use(external_markdown_it_footnote_namespaceObject).use(extensions, {
    trusted: options.trusted === true,
    diagnose: diagnose
  });
  var renderImage = md.renderer.rules.image;
  md.renderer.rules.image = function (tokens, index, opts, env, self) {
    var token = tokens[index];
    var src = token.attrGet('src');
    if (src !== null && src !== void 0 && src.startsWith('attachment:')) {
      var _env$attachments;
      var name = src.slice(11);
      try {
        name = decodeURIComponent(name);
      } catch (_unused) {/* Report as missing below. */}
      var bundle = Object.hasOwn((_env$attachments = env.attachments) !== null && _env$attachments !== void 0 ? _env$attachments : {}, name) ? env.attachments[name] : null;
      var url = image(bundle);
      if (!url) {
        diagnose('missing-attachment', "Missing or unsupported attachment: ".concat(name));
        return "<span class=\"ipynb-diagnostic\">[Attachment: ".concat(escapeHtml(name), "]</span>");
      }
      token.attrSet('src', url);
    }
    return renderImage(tokens, index, opts, env, self);
  };
  if (options.externalLinks === 'new-tab') {
    md.renderer.rules.link_open = function (tokens, index, opts, env, self) {
      var _tokens$index$attrGet;
      if (/^https?:\/\//i.test((_tokens$index$attrGet = tokens[index].attrGet('href')) !== null && _tokens$index$attrGet !== void 0 ? _tokens$index$attrGet : '')) {
        tokens[index].attrSet('target', '_blank');
        tokens[index].attrSet('rel', 'noopener noreferrer');
      }
      return self.renderToken(tokens, index, opts);
    };
  }
  return md;
}
;// ./src/convert_util.mjs
function convert_util_slicedToArray(r, e) { return convert_util_arrayWithHoles(r) || convert_util_iterableToArrayLimit(r, e) || convert_util_unsupportedIterableToArray(r, e) || convert_util_nonIterableRest(); }
function convert_util_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function convert_util_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function convert_util_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function convert_util_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = convert_util_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function convert_util_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return convert_util_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? convert_util_arrayLikeToArray(r, a) : void 0; } }
function convert_util_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }


/**
 *  @fileOverview Utility functions used by the [convert](module-convert.html).
 *  @module convert_util
 *  @exports {Object} - An object containing utility functions.
 *  @author Charles Karpati
 */

/**
 * Creates an HTML details element with the given content. Called by [processOutput](module-convert.html#.processOutput) and [processSource](module-convert.html#.processSource).
 *
 * @param {string} content - The HTML content to be placed inside the details tag.
 * @param {boolean} open - Determines if the details should be open by default.
 * @returns {string} An HTML string representing a details element.
 * @memberof module:convert_util
 */
function makeDetails(content, open) {
  var cellType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'input';
  var normalizedType = cellType === 'output' ? 'output' : 'input';
  var classes = "ipynb  ipynb-".concat(normalizedType);
  return "<details class='".concat(classes, "' data-cell-type='").concat(normalizedType, "' ").concat(open ? 'open' : '', "> <summary>").concat(normalizedType === 'input' ? 'Code' : 'Output', "</summary> ").concat(content, "</details>");
}

/**
 * Replaces specified emoji characters in the text with their corresponding HTML entities. Convert emojis to html entities
 *
 * @param {string} text - The text containing emojis to be replaced.
 * @returns {string} The text with emojis replaced by HTML entities.
 * @memberof module:convert_util
 */
function replaceEmojis(text) {
  // Dec => Code => https://apps.timwhitlock.info/unicode/inspect/hex/1F633
  text = text.replaceAll("🙂", "&#1F642");
  text = text.replaceAll("😳", "&#128563");
  text = text.replaceAll("\u2003", "&#8195");
  text = text.replaceAll("👷", "&#128119");
  text = text.replaceAll("🧡", "&#129505");
  text = text.replaceAll("💖", "&#128150");
  return text;
}

/**
 * Wraps specified header levels and their content in collapsible details elements.
 * Processes headers from highest level (h2) to lowest (h6) to maintain hierarchy.
 * A header's content includes all content until the next header of equal or higher significance.
 *
 * @param {string} content - The HTML content containing headers to be collapsed.
 * @param {string} headers - Comma-separated list of header levels to collapse (e.g., "h2,h3").
 * @param {boolean} open - Determines if the details should be open by default.
 * @returns {string} The HTML content with specified headers wrapped in details elements.
 * @memberof module:convert_util
 */
function collapseHeaders(content, headers, open) {
  // console.log('%c Collapsing headers:', 'font-size: 24px; font-weight: bold; color: #0066cc;', headers, 'open:', open);
  if (!headers || headers.length === 0) {
    return content;
  }

  // Parse header levels (e.g., "h2,h3" -> [2, 3]) and sort ascending
  var headerLevels = headers.split(',').map(function (h) {
    return parseInt(h.trim().slice(1));
  }).sort(function (a, b) {
    return a - b;
  });

  // console.log('Header levels to collapse:', headerLevels);

  // Process from highest level (h2) to lowest (h6) to maintain hierarchy
  var _iterator = convert_util_createForOfIteratorHelper(headerLevels),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var level = _step.value;
      var headerPattern = "<(h".concat(level, ")([^>]*)>([\\s\\S]*?)</\\1>");
      var regex = new RegExp(headerPattern, 'gi');
      var parts = [];
      var lastIndex = 0;
      var match = void 0;
      while ((match = regex.exec(content)) !== null) {
        var _match = match,
          _match2 = convert_util_slicedToArray(_match, 4),
          fullMatch = _match2[0],
          tag = _match2[1],
          attrs = _match2[2],
          headerText = _match2[3];

        // Add content before this header
        if (match.index > lastIndex) {
          parts.push(content.slice(lastIndex, match.index));
        }

        // Find content until next header of equal or higher significance (lower number)
        var nextHeaderRegex = new RegExp("<h[1-".concat(level, "][^>]*>"), 'i');
        var searchStart = match.index + fullMatch.length;
        var nextMatch = nextHeaderRegex.exec(content.slice(searchStart));
        var contentEnd = nextMatch ? searchStart + nextMatch.index : content.length;
        var innerContent = content.slice(searchStart, contentEnd);
        parts.push("<details".concat(open ? ' open' : '', ">") + "<summary><".concat(tag).concat(attrs, ">").concat(headerText, "</").concat(tag, "></summary>") + innerContent + "</details>");
        lastIndex = contentEnd;
        regex.lastIndex = contentEnd;
      }

      // Add remaining content
      if (lastIndex < content.length) {
        parts.push(content.slice(lastIndex));
      }
      content = parts.join('');
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return content;
}

/**
 * Replaces occurrences of a pattern in a string and optionally logs the replacement.
 *
 * @param {string} text - The text in which replacements are to be made.
 * @param {RegExp|string} input - The pattern to search for in the text.
 * @param {Function|string} output - The replacement text or a function that returns the replacement text.
 * @returns {string} The text after performing the replacements.
 * @memberof module:convert_util
 */
function replaceAndLog(text, input, output) {
  return text.replace(input, function (match, capture) {
    var _output$replace;
    return ((_output$replace = output.replace) === null || _output$replace === void 0 ? void 0 : _output$replace.call(output, '$1', capture)) || output(match, capture);
  });
}
;

// Compatibility utility: accepts Markdown source, not rendered HTML.
function convertNotes(source) {
  var _content$match;
  var startCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var md = createMarkdown(options, function () {}, function () {
    return null;
  });
  var content = md.render(source, {
    docId: "notes-".concat(startCount)
  });
  var count = startCount + ((_content$match = content.match(/class="footnote-item"/g)) !== null && _content$match !== void 0 ? _content$match : []).length;
  return {
    content: content,
    count: count
  };
}

;// ./src/convert.mjs
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function convert_slicedToArray(r, e) { return convert_arrayWithHoles(r) || convert_iterableToArrayLimit(r, e) || convert_unsupportedIterableToArray(r, e) || convert_nonIterableRest(); }
function convert_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function convert_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function convert_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function convert_typeof(o) { "@babel/helpers - typeof"; return convert_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, convert_typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == convert_typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != convert_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != convert_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function convert_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = convert_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function convert_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return convert_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? convert_arrayLikeToArray(r, a) : void 0; } }
function convert_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * Browser/build notebook rendering; never executes cells.
 * @module convert
 */



var imageTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp', 'image/gif'];
var mimeOrder = ['text/html', 'application/javascript'].concat(imageTypes, ['text/plain', 'application/json']);
var legacy = {
  '#hide': {
    include: false
  },
  '#hide_input': {
    echo: false
  },
  '#hide_output': {
    output: false
  },
  '#collapse_input': {
    'code-fold': true
  },
  '#collapse_input_open': {
    'code-fold': 'show'
  },
  '#collapse_output': {
    'output-fold': true
  },
  '#collapse_output_open': {
    'output-fold': 'show'
  },
  '#export': {
    "export": true
  }
};
function codeOptions(source, diagnose) {
  var lines = source.split('\n');
  var old = {},
    conventional = {};
  var count = 0;
  var _iterator = convert_createForOfIteratorHelper(lines),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var line = _step.value;
      var trimmed = line.trim();
      if (trimmed.startsWith('#|')) {
        try {
          var value = parseYaml(trimmed.slice(2).trim().replace(/^([\w-]+):(?=\S)/, '$1: '));
          if (!value || convert_typeof(value) !== 'object' || Array.isArray(value)) throw new Error('Expected key: value');
          for (var _i = 0, _Object$entries = Object.entries(value); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = convert_slicedToArray(_Object$entries[_i], 2),
              key = _Object$entries$_i[0],
              item = _Object$entries$_i[1];
            if (!['echo', 'output', 'include', 'code-fold', 'output-fold'].includes(key)) {
              diagnose('unsupported-option', "Rendering does not handle #| ".concat(key));
            } else if (typeof item !== 'boolean' && !(['code-fold', 'output-fold'].includes(key) && item === 'show')) {
              diagnose('invalid-option', "Invalid value for #| ".concat(key));
            } else conventional[key] = item;
          }
        } catch (error) {
          diagnose('invalid-option', error.message);
        }
      } else {
        var flags = trimmed.split(/\s+/);
        if (!flags.length || !flags.every(function (flag) {
          return Object.hasOwn(legacy, flag);
        })) break;
        var _iterator2 = convert_createForOfIteratorHelper(flags),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var flag = _step2.value;
            Object.assign(old, legacy[flag]);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      count++;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return {
    options: _objectSpread(_objectSpread({}, old), conventional),
    source: lines.slice(count).join('\n')
  };
}
function context() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var extractAssets = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var notebookName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'notebook';
  var verbose = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var result = {
    assets: [],
    diagnostics: [],
    pyCode: []
  };
  var index = 0;
  var cellIndex = 0;
  var trusted = options.trusted === true;
  var diagnose = function diagnose(code, message) {
    var diagnostic = {
      code: code,
      cell: cellIndex + 1,
      message: message
    };
    result.diagnostics.push(diagnostic);
    if (verbose) console.warn('ipynb2web:', diagnostic);
  };
  var shouldExtract = function shouldExtract(type) {
    return extractAssets === true || Array.isArray(extractAssets) && extractAssets.some(function (item) {
      var name = String(item).toLowerCase();
      return [type, type.split('/')[1], {
        'image/svg+xml': 'svg',
        'image/jpeg': 'jpg',
        'application/javascript': 'js',
        'text/plain': 'txt'
      }[type]].includes(name);
    });
  };
  var asset = function asset(type, data, encoding) {
    var _imageSvgXml$image;
    var extension = (_imageSvgXml$image = {
      'image/svg+xml': 'svg',
      'image/jpeg': 'jpg',
      'text/html': 'html',
      'application/javascript': 'js'
    }[type]) !== null && _imageSvgXml$image !== void 0 ? _imageSvgXml$image : type.split('/')[1];
    var prefix = (typeof notebookName === 'string' ? notebookName : 'notebook').replace(/[^a-zA-Z0-9_-]/g, '_') || 'notebook';
    var name = "".concat(prefix, "-asset-").concat(++index, ".").concat(extension);
    result.assets.push({
      placeholderName: name,
      data: data,
      encoding: encoding,
      type: type,
      notebookPrefix: "".concat(prefix, "-")
    });
    return "ASSET_PLACEHOLDER_".concat(name);
  };
  var image = function image(bundle) {
    if (!bundle || convert_typeof(bundle) !== 'object') return null;
    var _iterator3 = convert_createForOfIteratorHelper(imageTypes),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var type = _step3.value;
        if (!Object.hasOwn(bundle, type)) continue;
        var data = _sourceText(bundle[type]);
        if (!data.trim()) {
          diagnose('invalid-image', "Empty ".concat(type, " output"));
          continue;
        }
        var svg = type === 'image/svg+xml';
        if (svg ? !/<svg[\s>]/i.test(data) : !/^[\da-z+/=\s]+$/i.test(data)) {
          diagnose('invalid-image', "Invalid ".concat(type, " output"));
          continue;
        }
        // SVG is an image resource, never active inline DOM, in the default mode.
        if (shouldExtract(type)) return asset(type, data, svg ? 'utf8' : 'base64');
        return svg ? "data:".concat(type, ",").concat(encodeURIComponent(data)) : "data:".concat(type, ";base64,").concat(data.replace(/\s/g, ''));
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return null;
  };
  var md = markdown_createMarkdown(options, diagnose, image);
  var pre = function pre(text) {
    return "<pre><code>".concat(escapeHtml(text), "</code></pre>");
  };
  var missing = function missing(message) {
    diagnose('unsupported-output', message);
    return "<pre class=\"ipynb-diagnostic\">".concat(escapeHtml(message), "</pre>");
  };
  var output = function output(saved) {
    if (!saved || convert_typeof(saved) !== 'object') return missing('Missing saved output');
    if (saved.output_type === 'stream') {
      if (saved.name === 'stderr') diagnose('stderr', _sourceText(saved.text));
      return pre(_sourceText(saved.text));
    }
    if (saved.output_type === 'error') {
      var _saved$traceback, _saved$ename, _saved$evalue;
      var message = _sourceText(((_saved$traceback = saved.traceback) === null || _saved$traceback === void 0 ? void 0 : _saved$traceback.join('\n')) || "".concat((_saved$ename = saved.ename) !== null && _saved$ename !== void 0 ? _saved$ename : 'Error', ": ").concat((_saved$evalue = saved.evalue) !== null && _saved$evalue !== void 0 ? _saved$evalue : ''));
      diagnose('saved-error', message);
      return pre(message);
    }
    var bundle = saved.data;
    if (!bundle || convert_typeof(bundle) !== 'object') return missing('Saved output has no MIME data');
    if (!trusted && (Object.hasOwn(bundle, 'text/html') || Object.hasOwn(bundle, 'application/javascript'))) {
      diagnose('untrusted-output', 'Rich HTML/JavaScript requires the host option trusted: true; using an inert representation');
    }
    var _iterator4 = convert_createForOfIteratorHelper(mimeOrder),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var type = _step4.value;
        if (!Object.hasOwn(bundle, type) || bundle[type] == null) continue;
        var data = _sourceText(bundle[type]);
        if (type === 'text/html' || type === 'application/javascript') {
          if (!trusted || !data.trim()) continue;
          if (type === 'text/html') {
            return shouldExtract(type) ? "<iframe src=\"".concat(asset(type, data, 'utf8'), "\" title=\"Notebook output\"></iframe>") : data;
          }
          // A data URL avoids closing-script sequences corrupting the HTML wrapper.
          var url = shouldExtract(type) ? asset(type, data, 'utf8') : "data:text/javascript,".concat(encodeURIComponent(data));
          return "<script src=\"".concat(escapeHtml(url), "\"></script>");
        }
        if (type.startsWith('image/')) {
          var _url = image(_defineProperty({}, type, bundle[type]));
          if (_url) return "<img src=\"".concat(escapeHtml(_url), "\" alt=\"Notebook output\">");
          continue;
        }
        if (type === 'application/json') return pre(JSON.stringify(bundle[type], null, 2));
        return pre(data);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    if (!trusted) {
      var _bundle$textHtml;
      var rich = (_bundle$textHtml = bundle['text/html']) !== null && _bundle$textHtml !== void 0 ? _bundle$textHtml : bundle['application/javascript'];
      if (rich != null) return pre(_sourceText(rich));
    }
    return missing("Unsupported saved output MIME types: ".concat(Object.keys(bundle).join(', ') || '(none)'));
  };
  var render = function render(cell, index) {
    var _cell$outputs, _cell$outputs2;
    cellIndex = index;
    var text = _sourceText(cell === null || cell === void 0 ? void 0 : cell.source);
    if ((cell === null || cell === void 0 ? void 0 : cell.cell_type) === 'markdown') return md.render(text, {
      attachments: cell.attachments,
      docId: "cell-".concat(index + 1)
    });
    if ((cell === null || cell === void 0 ? void 0 : cell.cell_type) === 'raw') return pre(text);
    if ((cell === null || cell === void 0 ? void 0 : cell.cell_type) !== 'code') return missing("Unsupported cell type: ".concat(cell === null || cell === void 0 ? void 0 : cell.cell_type));
    var parsed = codeOptions(text, diagnose);
    var flags = parsed.options;
    if (flags["export"]) result.pyCode.push(parsed.source);
    if (flags.include === false) return '';
    if (/^\s*%%?\w/.test(parsed.source) && !((_cell$outputs = cell.outputs) !== null && _cell$outputs !== void 0 && _cell$outputs.length)) {
      diagnose('unexecuted-magic', 'IPython magic has no saved output; the renderer does not execute it');
    }
    var input = flags.echo === false || !parsed.source ? '' : pre(parsed.source);
    if (input && flags['code-fold']) input = makeDetails(input, flags['code-fold'] === 'show', 'input');
    var saved = (_cell$outputs2 = cell.outputs) !== null && _cell$outputs2 !== void 0 ? _cell$outputs2 : [];
    var outputs = flags.output === false ? '' : Array.isArray(saved) ? saved.map(output).join('\n') : missing('Expected a saved outputs array');
    if (outputs && flags['output-fold']) outputs = makeDetails(outputs, flags['output-fold'] === 'show', 'output');
    return input + outputs;
  };
  return _objectSpread(_objectSpread({}, result), {}, {
    render: render
  });
}

/** Render a parsed notebook, without I/O or execution. Options are host-owned,
 * never read from notebook metadata. Returns { meta, content, assets, diagnostics }.
 */
function renderNotebook(notebook) {
  var _options$filename;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!notebook || !Array.isArray(notebook.cells)) throw new Error('Invalid notebook: expected cells array');
  var _readMetadata = readMetadata(notebook.cells[0]),
    meta = _readMetadata.meta,
    consumed = _readMetadata.consumed,
    remainder = _readMetadata.remainder;
  if (!Object.hasOwn(meta, 'filename')) meta.filename = (_options$filename = options.filename) !== null && _options$filename !== void 0 ? _options$filename : 'notebook';
  var ctx = context(options, options.extractAssets, meta.filename, options.verbose);
  var content = notebook.cells.map(function (cell, index) {
    if (index === 0 && consumed) return remainder ? ctx.render(_objectSpread(_objectSpread({}, cell), {}, {
      source: remainder
    }), index) : '';
    return ctx.render(cell, index);
  }).join('\n');
  if (ctx.pyCode.length && !Object.hasOwn(meta, 'pyCode')) meta.pyCode = ctx.pyCode;
  return {
    meta: meta,
    content: content,
    assets: ctx.assets,
    diagnostics: ctx.diagnostics
  };
}

/** Fetch and render a notebook. Positional verbose/extractAssets arguments remain
 * supported; the fourth argument holds host options such as { trusted: true }.
 * Node's historical extensionless localhost:8085 paths remain supported.
 */
function nb2json(_x) {
  return _nb2json.apply(this, arguments);
}

// Low-level compatibility export. Use renderNotebook to receive assets/diagnostics.
function _nb2json() {
  _nb2json = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(ipynbPath) {
    var _options$filename2;
    var verbose,
      extractAssets,
      options,
      _options$verbose,
      _options$extractAsset,
      url,
      response,
      filename,
      _args = arguments,
      _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          verbose = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
          extractAssets = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
          options = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
          if (convert_typeof(verbose) === 'object' && verbose !== null) {
            options = verbose;
            verbose = (_options$verbose = options.verbose) !== null && _options$verbose !== void 0 ? _options$verbose : false;
            extractAssets = (_options$extractAsset = options.extractAssets) !== null && _options$extractAsset !== void 0 ? _options$extractAsset : false;
          }
          url = String(ipynbPath);
          if (typeof window === 'undefined' && !/^[a-z][a-z\d+.-]*:/i.test(url)) {
            url = "http://localhost:8085/".concat(url.replace(/^\//, '')).concat(url.endsWith('.ipynb') ? '' : '.ipynb');
          }
          _context.n = 1;
          return fetch(url);
        case 1:
          response = _context.v;
          if (response.ok) {
            _context.n = 2;
            break;
          }
          throw new Error("Notebook fetch failed (".concat(response.status, "): ").concat(url));
        case 2:
          filename = (_options$filename2 = options.filename) !== null && _options$filename2 !== void 0 ? _options$filename2 : /^(?:data|blob):/i.test(url) ? 'notebook' : String(ipynbPath).split('/').pop().split(/[?#]/)[0].replace(/\.ipynb$/i, '').toLowerCase().replaceAll(' ', '_');
          _t = renderNotebook;
          _context.n = 3;
          return response.json();
        case 3:
          return _context.a(2, _t(_context.v, _objectSpread(_objectSpread({}, options), {}, {
            verbose: verbose,
            extractAssets: extractAssets,
            filename: filename
          })));
      }
    }, _callee);
  }));
  return _nb2json.apply(this, arguments);
}
function convertNb(cells) {
  var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var extractAssets = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var notebookName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var ctx = context(options, extractAssets, notebookName !== null && notebookName !== void 0 ? notebookName : meta.filename, verbose);
  return cells.map(ctx.render);
}


/***/ }),

/***/ 233:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSpeech: () => (/* binding */ createSpeech),
/* harmony export */   getTextFromJson: () => (/* binding */ getTextFromJson),
/* harmony export */   saveSpeech: () => (/* binding */ saveSpeech),
/* harmony export */   speechFromDir: () => (/* binding */ speechFromDir)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(383);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * @fileOverview Provides functionalities for generating audio content from text and JSON data using OpenAI's APIs. 
 * 
 * This module contains functions for creating speech from text input, saving audio files, extracting text from JSON for speech synthesis, and converting JSON data to audio files in a specified directory. It leverages OpenAI's text-to-speech and GPT-4 models to process and convert textual content into spoken audio, supporting various customization options like voice model and speech speed. 
 * 
 * Functions exposed from [cli](module-Ipynb2web_cli.html) and [node](module-Ipynb2web_node.html).
 * @module create_audio
 * @exports {Object} - Exports functions like createSpeech, saveSpeech, getTextFromJson, and speechFromDir for audio processing and generation.
 * @author Charles Karpati
 */




/**
 * Creates an audio speech from text using the OpenAI API.
 * 
 * @async
 * @public
 * @param {string} input - The text to be converted into speech.
 * @param {string} [apikey] - The OpenAI API key. If not provided, it will use the environment variable 'OPENAI_API_KEY'.
 * @param {string} [voice='echo'] - The voice model to use.
 * @param {number} [speed=1.0] - The speed of the speech (0.25 to 4.0).
 * @param {string} [model='tts-1'] - The speech model to use.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {Buffer|null} The audio data as a Buffer, or null if an error occurs or no API key is provided.
 * @throws {Error} Logs an error to the console if fetching the speech fails and verbose is true.
 * @memberof module:create_audio
 */
function createSpeech(_x, _x2) {
  return _createSpeech.apply(this, arguments);
}
/**
 * Saves the given audio buffer to a file.
 *
 * @async
 * @param {string} mp3SaveFilePath - The file path where the MP3 should be saved.
 * @param {Buffer} buffer - The audio data to be saved.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; saves the audio buffer to a file.
 * @throws {Error} Logs an error to the console if there is a failure in saving the audio file and verbose is true.
 * @memberof module:create_audio
 */
function _createSpeech() {
  _createSpeech = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(input, apikey) {
    var voice,
      speed,
      model,
      verbose,
      openai,
      mp3Response,
      buffer,
      _args = arguments,
      _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          voice = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'echo';
          speed = _args.length > 3 && _args[3] !== undefined ? _args[3] : 1.0;
          model = _args.length > 4 && _args[4] !== undefined ? _args[4] : 'tts-1';
          verbose = _args.length > 5 && _args[5] !== undefined ? _args[5] : false;
          if (!apikey) {
            apikey = process.env.OPENAI_API_KEY;
          }
          if (apikey) {
            _context.n = 1;
            break;
          }
          verbose && console.log('No API Key provided and \"env.OPENAI_API_KEY\" not found.');
          return _context.a(2);
        case 1:
          _context.p = 1;
          openai = new OpenAI(apikey); // Speed [ `0.25` - `4.0`]. default = `1.0`. 
          // The maximum length is 4096 characters.
          _context.n = 2;
          return fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
              'Authorization': "Bearer ".concat(apikey),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: model,
              input: input,
              voice: voice,
              speed: speed,
              response_format: 'mp3'
            })
          });
        case 2:
          mp3Response = _context.v;
          _context.n = 3;
          return mp3Response.buffer();
        case 3:
          buffer = _context.v;
          _context.n = 5;
          break;
        case 4:
          _context.p = 4;
          _t = _context.v;
          verbose && console.log('createSpeech error', _t);
          return _context.a(2);
        case 5:
          return _context.a(2, buffer);
      }
    }, _callee, null, [[1, 4]]);
  }));
  return _createSpeech.apply(this, arguments);
}
function saveSpeech(_x3, _x4) {
  return _saveSpeech.apply(this, arguments);
}
/**
 * Pass json to chatGPT and ask it to extract the text for speech using gpt4.
 *
 * @async
 * @param {Object} json - The JSON object containing the data to extract text from.
 * @param {string} [apikey] - The OpenAI API key. If not provided, it will use the environment variable 'OPENAI_API_KEY'.
 * @param {string} [model='gpt-4o-mini'] - The text model to use.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {string|null} The extracted text from the JSON object, or null if an error occurs or no API key is provided.
 * @throws {Error} Logs an error to the console if there is an error in fetching or processing the request and verbose is true.
 * @memberof module:create_audio
 */
function _saveSpeech() {
  _saveSpeech = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(mp3SaveFilePath, buffer) {
    var verbose,
      _args2 = arguments,
      _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          verbose = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : false;
          _context2.p = 1;
          _context2.n = 2;
          return fs__WEBPACK_IMPORTED_MODULE_0__.promises.writeFile(mp3SaveFilePath, buffer);
        case 2:
          verbose && console.log("Audio saved to ".concat(mp3SaveFilePath));
          _context2.n = 4;
          break;
        case 3:
          _context2.p = 3;
          _t2 = _context2.v;
          verbose && console.log('saveSpeech error', _t2);
        case 4:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 3]]);
  }));
  return _saveSpeech.apply(this, arguments);
}
function getTextFromJson(_x5, _x6) {
  return _getTextFromJson.apply(this, arguments);
}
/**
 * Converts all JSON files in a directory to speech files.
 * Recursively processes directories and skips non-JSON files.
 *
 * @async
 * @param {string} fromFolder - The directory containing JSON files.
 * @param {string} toFolder - The directory where the resulting MP3 files will be saved.
 * @param {string} [apikey] - The OpenAI API key. If not provided, it will use the environment variable 'OPENAI_API_KEY'.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; processes files in place.
 * @throws {Error} Logs an error to the console if there is a failure in reading the directory or processing files and verbose is true.
 * @memberof module:create_audio
 */
function _getTextFromJson() {
  _getTextFromJson = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(json, apikey) {
    var model,
      verbose,
      text,
      requestBody,
      response,
      _data,
      responseData,
      _args3 = arguments,
      _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          model = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : 'gpt-4o-mini';
          verbose = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : false;
          if (!apikey) {
            apikey = process.env.OPENAI_API_KEY;
          }
          if (apikey) {
            _context3.n = 1;
            break;
          }
          verbose && console.log('No API Key provided and \"env.OPENAI_API_KEY\" not found.');
          return _context3.a(2);
        case 1:
          _context3.p = 1;
          text = !json.title ? '' : "Title:   ".concat(json.title, " \n ");
          text += !json.summary ? '' : "Summary: ".concat(json.summary, " \n ");
          text += "Content: ".concat(JSON.stringify(json.content));
          requestBody = {
            model: model,
            messages: [{
              "role": "system",
              "content": "\nYou are an assistant to a webpage to audio service. \nYou will be given a webpage you must convert it to a form of text ready for reading aloud.\nStart every conversion with a statement \"You are listening to the audio version of this webpage\" followed by the title and summary.\nUnder no circumstances should code be read and should be paraphrased or skipped. \n"
            }, {
              "role": "user",
              "content": text
            }]
          };
          _context3.n = 2;
          return fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': "Bearer ".concat(apikey),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });
        case 2:
          response = _context3.v;
          _context3.n = 3;
          return response.json();
        case 3:
          responseData = _context3.v;
          _data = responseData.choices[0].message.content;
          _context3.n = 5;
          break;
        case 4:
          _context3.p = 4;
          _t3 = _context3.v;
          verbose && console.log('getTextFromJson error', _t3);
          return _context3.a(2);
        case 5:
          return _context3.a(2, data);
      }
    }, _callee3, null, [[1, 4]]);
  }));
  return _getTextFromJson.apply(this, arguments);
}
function speechFromDir(_x7, _x8, _x9) {
  return _speechFromDir.apply(this, arguments);
}
function _speechFromDir() {
  _speechFromDir = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(fromFolder, toFolder, apikey) {
    var verbose,
      files,
      i,
      filename,
      stat,
      _json$meta,
      file,
      json,
      text,
      buffer,
      _file,
      savePath,
      _args4 = arguments,
      _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          verbose = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : false;
          if (!apikey) {
            apikey = process.env.OPENAI_API_KEY;
          }
          if (apikey) {
            _context4.n = 1;
            break;
          }
          verbose && console.log('No API Key provided and \"env.OPENAI_API_KEY\" not found.');
          return _context4.a(2);
        case 1:
          _context4.p = 1;
          files = fs__WEBPACK_IMPORTED_MODULE_0__.readdirSync(fromFolder);
          i = 0;
        case 2:
          if (!(i < files.length)) {
            _context4.n = 7;
            break;
          }
          filename = path__WEBPACK_IMPORTED_MODULE_1__.join(fromFolder, files[i]);
          stat = fs__WEBPACK_IMPORTED_MODULE_0__.lstatSync(filename);
          if (!stat.isDirectory()) {
            _context4.n = 3;
            break;
          }
          speechFromDir(filename, toFolder); //recurse
          _context4.n = 6;
          break;
        case 3:
          if (!(filename.indexOf('.json') >= 0)) {
            _context4.n = 6;
            break;
          }
          file = fs__WEBPACK_IMPORTED_MODULE_0__.readFileSync(filename, 'utf8');
          json = JSON.parse(file);
          if (!(json !== null && json !== void 0 && (_json$meta = json.meta) !== null && _json$meta !== void 0 && _json$meta.audio)) {
            _context4.n = 6;
            break;
          }
          _context4.n = 4;
          return getTextFromJson(json);
        case 4:
          text = _context4.v;
          _context4.n = 5;
          return createSpeech(text, apikey);
        case 5:
          buffer = _context4.v;
          _file = files[i].substring(0, files[i].length - 5); // console.log('file', file)
          savePath = path__WEBPACK_IMPORTED_MODULE_1__.join(toFolder, _file) + '.mp3'; // console.log('savePath', savePath)
          saveSpeech(savePath, buffer);
        case 6:
          i++;
          _context4.n = 2;
          break;
        case 7:
          _context4.n = 9;
          break;
        case 8:
          _context4.p = 8;
          _t4 = _context4.v;
          verbose && console.log('speechFromDir error', _t4);
          return _context4.a(2);
        case 9:
          return _context4.a(2);
      }
    }, _callee4, null, [[1, 8]]);
  }));
  return _speechFromDir.apply(this, arguments);
}


/***/ }),

/***/ 383:
/***/ ((module) => {

module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src_cli)
});

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(383);
// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(3);
;// external "crypto"
const external_crypto_namespaceObject = require("crypto");
;// external "http-server"
const external_http_server_namespaceObject = require("http-server");
;// ./src/prerender.mjs
var _excluded = ["csp", "sitemap", "breadcrumbs", "badges", "keywords", "comments", "hide", "image", "toc", "title"],
  _excluded2 = ["csp", "sitemap", "breadcrumbs", "badges", "keywords", "comments", "hide", "image", "toc", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * @fileOverview Provides functionalities for processing Jupyter Notebook files (.ipynb) 
 * 
 * The module serves as the core of the ipynb2web conversion pipeline, handling various stages of content transformation and site structure generation. This includes converting notebooks to HTML, creating audio files from specified content, generating sitemaps for web navigation, and publishing processed files. 
 * 
 * Functions exposed from [node](module-Ipynb2web_node.html) and [cli](module-Ipynb2web_cli.html) into different web formats and managing related assets. 
 * @module prerender
 * @exports {Object} - Exports functions like createAudio, createSitemap, and cli_nbs2html for processing Jupyter Notebooks and related assets.
 * @author Charles Karpati
 */






/**
 * Helper function to get file extension from MIME type
 * @param {string} mimeType - The MIME type (e.g., 'text/html', 'image/png')
 * @returns {string} The file extension (e.g., 'html', 'png')
 */
function getExtensionFromType(mimeType) {
  if (!mimeType) return 'txt';
  var typeMap = {
    'text/html': 'html',
    'text/plain': 'txt',
    'application/javascript': 'js',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/webp': 'webp'
  };
  return typeMap[mimeType] || mimeType.split('/')[1] || 'txt';
}

/** 
 * Checks YAML for `audio` tag and creates the file
 *
 * @async
 * @memberof module:prerender
 * @param {string} [from='./src/posts/'] - The source directory containing content to be converted to audio.
 * @param {string} [to='./src/client/audio/'] - The target directory where audio files will be saved.
 */
function createAudio() {
  return _createAudio.apply(this, arguments);
}
/**
 * Appends each ipynb to sitemap.txt by calling [process Directory](module-prerender.html#.processDirectory).
 *
 * @async
 * @memberof module:prerender
 * @param {string} [search='./'] - The directory to search for JSON map files.
 * @param {string} [sitemapFile='./sitemap.txt'] - The file path where the sitemap will be saved.
 * @param {string} [pathPrefix=''] - A prefix to add to all URLs in the sitemap (e.g., '/docs').
 * @param {string|boolean} [domain=''] - Optional domain (or site URL) to prefix all sitemap URLs (e.g., 'https://example.com').
 *   Backwards compatible: if a boolean is passed here, it will be treated as `verbose` (older signature).
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; processes and writes to the sitemap file directly.
 * @throws {Error} Logs an error to the console if there is a failure in writing the sitemap file and verbose is true.
 */
function _createAudio() {
  _createAudio = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var from,
      to,
      _yield$import,
      speechFromDir,
      _args = arguments;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          from = _args.length > 0 && _args[0] !== undefined ? _args[0] : './src/posts/';
          to = _args.length > 1 && _args[1] !== undefined ? _args[1] : './src/client/audio/';
          _context.n = 1;
          return Promise.resolve(/* import() | audio */).then(__webpack_require__.bind(__webpack_require__, 233));
        case 1:
          _yield$import = _context.v;
          speechFromDir = _yield$import.speechFromDir;
          speechFromDir(from, to);
        case 2:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _createAudio.apply(this, arguments);
}
function createSitemap() {
  return _createSitemap.apply(this, arguments);
}
/**
 * Recursively searches for _map.json files created from [[cli_nbs2html](module-prerender.html#.cli_nbs2html)->[generate_sectionmap](module-prerender.html#.generate_sectionmap) and appends the mappings to sitemap.txt.
 *
 * @async
 * @memberof module:prerender 
 * @param {string} directory - The directory to process.
 * @param {string} [subdir=''] - A subdirectory path to append to each URL in the sitemap.
 * @param {string} [pathPrefix=''] - A prefix to add to all URLs in the sitemap (e.g., '/docs').
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {Array<string>} - An array to accumulate page URLs for the sitemap.
 * @throws {Error} Logs an error to the console if unable to process a directory and verbose is true.
 */
function _createSitemap() {
  _createSitemap = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var search,
      sitemapFile,
      pathPrefix,
      domain,
      verbose,
      prefix,
      d,
      pages,
      finalPages,
      uniquePages,
      _args2 = arguments,
      _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          search = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : './';
          sitemapFile = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : './sitemap.txt';
          pathPrefix = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : '';
          domain = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : '';
          verbose = _args2.length > 4 && _args2[4] !== undefined ? _args2[4] : true;
          // Backwards compatibility: older callers used createSitemap(search, sitemapFile, pathPrefix, verbose)
          typeof domain === 'boolean' && (verbose = domain, domain = '');
          prefix = pathPrefix ? String(pathPrefix).trim() : '';
          prefix = !prefix || prefix === "''" || prefix === '""' ? '' : (prefix = prefix.replace(/\/+$/, ''), prefix && !prefix.startsWith('/') ? '/' + prefix : prefix);
          d = domain ? String(domain).trim().replace(/\s+/g, '') : '';
          d = !d || d === "''" || d === '""' ? '' : (d = d.replace(/\/+$/, ''), d && !/^https?:\/\//i.test(d) ? "https://".concat(d) : d);
          verbose && console.log("\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ START createSitemap \n\n");
          _context2.n = 1;
          return processDirectory(search, '', prefix, verbose);
        case 1:
          pages = _context2.v;
          finalPages = d ? pages.map(function (p) {
            return !p ? "".concat(d, "/") : /^https?:\/\//i.test(p) ? p : d + (p.startsWith('/') ? p : '/' + p);
          }) : pages;
          uniquePages = Array.from(new Set(finalPages));
          verbose && console.log('pages', uniquePages);
          _context2.p = 2;
          _context2.n = 3;
          return external_fs_.promises.writeFile(sitemapFile, uniquePages.join('\n') + '\n');
        case 3:
          verbose && console.log('Sitemap file created successfully:', sitemapFile);
          _context2.n = 5;
          break;
        case 4:
          _context2.p = 4;
          _t = _context2.v;
          verbose && console.error("Error creating or truncating sitemap file: ".concat(sitemapFile), _t);
        case 5:
          return _context2.a(2);
      }
    }, _callee2, null, [[2, 4]]);
  }));
  return _createSitemap.apply(this, arguments);
}
function processDirectory(_x) {
  return _processDirectory.apply(this, arguments);
}
/**
 * Calls [generate_sectionmap](module-prerender.html#.generate_sectionmap) for each file in directory.
 *
 * @async
 * @memberof module:prerender
 * @param {string} [FROM='./'] - The directory containing .ipynb files to process.
 * @param {string} directory - A subdirectory to process within the FROM path.
 * @param {string} [SAVETO='./'] - The directory where the processed files will be saved.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @param {string} [assetsDir=null] - Optional directory path for saving static assets separately instead of inlining them.
 * @returns {void} Does not return a value; the function is used for processing files in place.
 * @throws {Error} Logs an error to the console if unable to process the specified directory and verbose is true.
 */
function _processDirectory() {
  _processDirectory = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(directory) {
    var subdir,
      pathPrefix,
      verbose,
      pages,
      excludedDirs,
      isExcluded,
      stat,
      files,
      _iterator,
      _step,
      file,
      subPages,
      _args4 = arguments,
      _t3;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          subdir = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : '';
          pathPrefix = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : '';
          verbose = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : false;
          pages = []; // check if node_modules, .git, etc. are in the path
          excludedDirs = ['node_modules', '.git', 'venv', 'env', '__pycache__', 'dist', 'build', '.idea', '.vscode', '.DS_Store', '.pytest_cache', '.mypy_cache', 'venv3', 'venv2', 'docs'];
          isExcluded = excludedDirs.some(function (dir) {
            return directory.includes(dir);
          });
          if (!isExcluded) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, pages);
        case 1:
          _context4.n = 2;
          return external_fs_.promises.stat(directory);
        case 2:
          stat = _context4.v;
          if (stat.isDirectory()) {
            _context4.n = 3;
            break;
          }
          return _context4.a(2, pages);
        case 3:
          console.log('prossdir', {
            directory: directory
          });
          _context4.n = 4;
          return external_fs_.promises.readdir(directory);
        case 4:
          files = _context4.v;
          _context4.n = 5;
          return Promise.all(files.filter(function (file) {
            return file.includes('_map.json');
          }).map(/*#__PURE__*/function () {
            var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(file) {
              var filePath, jsonData, section, _t2;
              return _regenerator().w(function (_context3) {
                while (1) switch (_context3.n) {
                  case 0:
                    filePath = external_path_.join(directory, file);
                    _t2 = JSON;
                    _context3.n = 1;
                    return external_fs_.promises.readFile(filePath, 'utf-8');
                  case 1:
                    jsonData = _t2.parse.call(_t2, _context3.v);
                    section = file.split('_')[0].split('.')[0];
                    jsonData.forEach(function (obj) {
                      if (!obj.filename) return;
                      var filename = String(obj.filename).replace(/^\/+/, '').replace(/\/+$/, '');
                      var isIndexSection = section === 'index';
                      var isSectionLanding = filename === section;
                      var isRootLanding = isIndexSection && filename === 'index';

                      // URL rules:
                      // - index_map + index      -> /
                      // - index_map + webdev     -> /webdev
                      // - blog_map + blog        -> /blog
                      // - blog_map + post        -> /blog/post
                      var routePath = '';
                      if (isRootLanding) {
                        routePath = '/';
                      } else if (isIndexSection) {
                        routePath = "/".concat(filename);
                      } else if (isSectionLanding) {
                        routePath = "/".concat(section);
                      } else {
                        routePath = "/".concat(section, "/").concat(filename);
                      }
                      var normalized = routePath === '/' ? '/' : routePath.replace(/\/+/g, '/');
                      pages.push(pathPrefix ? pathPrefix + normalized : normalized);
                    });
                  case 2:
                    return _context3.a(2);
                }
              }, _callee3);
            }));
            return function (_x1) {
              return _ref.apply(this, arguments);
            };
          }()));
        case 5:
          // Recursively process directories
          _iterator = _createForOfIteratorHelper(files.filter(function (file) {
            return !external_path_.extname(file);
          }));
          _context4.p = 6;
          _iterator.s();
        case 7:
          if ((_step = _iterator.n()).done) {
            _context4.n = 10;
            break;
          }
          file = _step.value;
          _context4.n = 8;
          return processDirectory(external_path_.join(directory, file), '', pathPrefix, verbose);
        case 8:
          subPages = _context4.v;
          pages = pages.concat(subPages);
        case 9:
          _context4.n = 7;
          break;
        case 10:
          _context4.n = 12;
          break;
        case 11:
          _context4.p = 11;
          _t3 = _context4.v;
          _iterator.e(_t3);
        case 12:
          _context4.p = 12;
          _iterator.f();
          return _context4.f(12);
        case 13:
          return _context4.a(2, pages);
      }
    }, _callee4, null, [[6, 11, 12, 13]]);
  }));
  return _processDirectory.apply(this, arguments);
}
function cli_nbs2html(_x2, _x3, _x4) {
  return _cli_nbs2html.apply(this, arguments);
}
/**
 * Calls [ipynb_publish](module-prerender.html#.ipynb_publish) on all files in the directory. 
 * - Also creates section_map.json which is later used in createSitemap()
 * - It excludes specified metadata fields from section_map.json
 * - Skips _filename.ipynb files entirely and won't add meta.hide yaml's to the section_map.json
 *
 * @async
 * @memberof module:prerender
 * @param {Array<string>} pages - An array of page names to process.
 * @param {string} FROM - The base directory containing .ipynb files.
 * @param {string} directory - A subdirectory to process.
 * @param {string} SAVETO - The directory where the section map will be saved.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @param {string} [assetsDir=null] - Optional directory path for saving static assets separately instead of inlining them.
 * @returns {void} Does not return a value; processes files and creates a section map.
 * @throws {Error} Logs an error to the console if there are issues creating the directory or writing the section map file and verbose is true.
 */
function _cli_nbs2html() {
  _cli_nbs2html = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(FROM, directory, SAVETO) {
    var verbose,
      assetsDir,
      renderOptions,
      stat,
      pages,
      _args5 = arguments;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          verbose = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : false;
          assetsDir = _args5.length > 4 && _args5[4] !== undefined ? _args5[4] : null;
          renderOptions = _args5.length > 5 && _args5[5] !== undefined ? _args5[5] : {};
          FROM || (FROM = './');
          SAVETO || (SAVETO = './');
          // Search the pathto directory for .ipynb files
          verbose && console.log("\n~ ~ ~ cli_nbs2html: ".concat(FROM).concat(directory, "\n"));
          // const stat = await fs.promises.stat(`${FROM}${directory}/`);
          _context5.n = 1;
          return external_fs_.promises.stat("".concat(FROM).concat(directory, "/"));
        case 1:
          stat = _context5.v;
          if (stat.isDirectory()) {
            _context5.n = 2;
            break;
          }
          verbose && console.log('\n\n UNABLE TO PROCESS DIRECTORY: ', directory);
          return _context5.a(2);
        case 2:
          _context5.n = 3;
          return external_fs_.promises.readdir("".concat(FROM).concat(directory, "/"));
        case 3:
          pages = _context5.v.filter(function (file) {
            return external_path_.extname(file) === ".ipynb";
          }).map(function (file) {
            return external_path_.parse(file).name;
          });
          return _context5.a(2, generate_sectionmap(pages, FROM, directory, SAVETO, verbose, assetsDir, renderOptions));
      }
    }, _callee5);
  }));
  return _cli_nbs2html.apply(this, arguments);
}
function generate_sectionmap(_x5, _x6, _x7, _x8) {
  return _generate_sectionmap.apply(this, arguments);
}
/**
 * Processes and publishes a Jupyter Notebook file, converting it to the specified format and saving it to a directory.
 * Optionally, extracts and saves Python code from the notebook.
 *
 * @async
 * @memberof module:prerender
 * @param {string} fullFilePath - The full path to the Jupyter Notebook file, including the filename and extension.
 * @param {string} saveDir - The directory where the processed file and any extracted Python code will be saved.
 * @param {string} [type='json'] - The format for the output file ('json' is the default format).
 * @param {string} [assetsDir=null] - Optional directory path for saving static assets separately instead of inlining them.
 * @returns {Object} The final processed data of the notebook.
 * @throws {Error} Logs an error to the console if there is a failure in writing the output file.
 */
function _generate_sectionmap() {
  _generate_sectionmap = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(pages, FROM, directory, SAVETO) {
    var verbose,
      assetsDir,
      renderOptions,
      server,
      links,
      assetsDirPath,
      _yield$ipynb_publish$,
      csp,
      sitemap,
      breadcrumbs,
      badges,
      keywords,
      comments,
      hide,
      image,
      toc,
      title,
      rest,
      _iterator2,
      _step2,
      page,
      _r,
      _r$meta,
      _csp,
      _sitemap,
      _breadcrumbs,
      _badges,
      _keywords,
      _comments,
      _hide,
      _image,
      _toc,
      _title,
      _rest,
      sitemapPath,
      _args6 = arguments,
      _t4,
      _t5,
      _t6,
      _t7,
      _t8,
      _t9;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          verbose = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : false;
          assetsDir = _args6.length > 5 && _args6[5] !== undefined ? _args6[5] : null;
          renderOptions = _args6.length > 6 && _args6[6] !== undefined ? _args6[6] : {};
          verbose && console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ cli_nbs2html: generate_sectionmap: ", pages, directory, verbose = false);
          server = external_http_server_namespaceObject.createServer({
            root: "./",
            cors: true,
            host: "0.0.0.0"
          });
          server.listen(8085, function () {});
          links = []; // Create saveto directory if it doesn't exist
          _context6.p = 1;
          _context6.n = 2;
          return external_fs_.promises.access("".concat(SAVETO).concat(directory));
        case 2:
          _context6.n = 9;
          break;
        case 3:
          _context6.p = 3;
          _t4 = _context6.v;
          if (!(_t4.code === "ENOENT")) {
            _context6.n = 8;
            break;
          }
          _context6.p = 4;
          _context6.n = 5;
          return external_fs_.promises.mkdir("".concat(SAVETO).concat(directory), {
            recursive: true
          });
        case 5:
          _context6.n = 7;
          break;
        case 6:
          _context6.p = 6;
          _t5 = _context6.v;
          console.error("Error creating directory:", _t5);
        case 7:
          _context6.n = 9;
          break;
        case 8:
          console.error("Error accessing directory:", _t4);
        case 9:
          if (!assetsDir) {
            _context6.n = 13;
            break;
          }
          _context6.p = 10;
          assetsDirPath = external_path_.isAbsolute(assetsDir) ? assetsDir : external_path_.join(SAVETO, assetsDir); // Try to create directory, will succeed silently if it already exists due to recursive: true
          _context6.n = 11;
          return external_fs_.promises.mkdir(assetsDirPath, {
            recursive: true
          });
        case 11:
          verbose && console.log("Assets directory ready: ".concat(assetsDirPath));
          _context6.n = 13;
          break;
        case 12:
          _context6.p = 12;
          _t6 = _context6.v;
          // Only log warning, don't throw - the directory might still be usable
          verbose && console.warn("Warning: Could not ensure assets directory exists:", _t6.message);
        case 13:
          if (!directory) {
            _context6.n = 15;
            break;
          }
          _context6.n = 14;
          return ipynb_publish("".concat(FROM).concat(directory), SAVETO, "json", assetsDir, renderOptions);
        case 14:
          _yield$ipynb_publish$ = _context6.v.meta;
          csp = _yield$ipynb_publish$.csp;
          sitemap = _yield$ipynb_publish$.sitemap;
          breadcrumbs = _yield$ipynb_publish$.breadcrumbs;
          badges = _yield$ipynb_publish$.badges;
          keywords = _yield$ipynb_publish$.keywords;
          comments = _yield$ipynb_publish$.comments;
          hide = _yield$ipynb_publish$.hide;
          image = _yield$ipynb_publish$.image;
          toc = _yield$ipynb_publish$.toc;
          title = _yield$ipynb_publish$.title;
          rest = _objectWithoutProperties(_yield$ipynb_publish$, _excluded);
          links.push(rest);
        case 15:
          // Call ipynb_publish and save for each page
          _iterator2 = _createForOfIteratorHelper(pages);
          _context6.p = 16;
          _iterator2.s();
        case 17:
          if ((_step2 = _iterator2.n()).done) {
            _context6.n = 21;
            break;
          }
          page = _step2.value;
          _t7 = !page.startsWith("_");
          if (!_t7) {
            _context6.n = 19;
            break;
          }
          _context6.n = 18;
          return ipynb_publish("".concat(FROM).concat(directory, "/").concat(page), "".concat(SAVETO).concat(directory), "json", assetsDir, renderOptions);
        case 18:
          _t7 = _context6.v;
        case 19:
          _r = _t7;
          if (_r && !!!_r.meta.hide) {
            _r$meta = _r.meta, _csp = _r$meta.csp, _sitemap = _r$meta.sitemap, _breadcrumbs = _r$meta.breadcrumbs, _badges = _r$meta.badges, _keywords = _r$meta.keywords, _comments = _r$meta.comments, _hide = _r$meta.hide, _image = _r$meta.image, _toc = _r$meta.toc, _title = _r$meta.title, _rest = _objectWithoutProperties(_r$meta, _excluded2);
            links.push(_rest);
          }
        case 20:
          _context6.n = 17;
          break;
        case 21:
          _context6.n = 23;
          break;
        case 22:
          _context6.p = 22;
          _t8 = _context6.v;
          _iterator2.e(_t8);
        case 23:
          _context6.p = 23;
          _iterator2.f();
          return _context6.f(23);
        case 24:
          sitemapPath = "".concat(SAVETO).concat(directory || 'index', "_map.json");
          _context6.p = 25;
          _context6.n = 26;
          return external_fs_.promises.writeFile(sitemapPath, JSON.stringify(links));
        case 26:
          _context6.n = 29;
          break;
        case 27:
          _context6.p = 27;
          _t9 = _context6.v;
          _context6.n = 28;
          return external_fs_.promises.writeFile(sitemapPath, "{}");
        case 28:
          verbose && console.log("----ERROR:", r.meta);
        case 29:
          server.close(function () {
            verbose && console.log("Server closed.");
          });
        case 30:
          return _context6.a(2);
      }
    }, _callee6, null, [[25, 27], [16, 22, 23, 24], [10, 12], [4, 6], [1, 3]]);
  }));
  return _generate_sectionmap.apply(this, arguments);
}
function ipynb_publish(_x9, _x0) {
  return _ipynb_publish.apply(this, arguments);
}
function _ipynb_publish() {
  _ipynb_publish = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(fullFilePath, saveDir) {
    var type,
      assetsDir,
      renderOptions,
      _final,
      _yield$import2,
      nb2json,
      _iterator3,
      _step3,
      _asset$type,
      asset,
      dataForHash,
      contentHash,
      finalFileName,
      assetPath,
      dataForWriting,
      relativePath,
      pyCode,
      file,
      pyCodeFilePath,
      txt,
      t,
      _args7 = arguments,
      _t0,
      _t1,
      _t10;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          type = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : "json";
          assetsDir = _args7.length > 3 && _args7[3] !== undefined ? _args7[3] : null;
          renderOptions = _args7.length > 4 && _args7[4] !== undefined ? _args7[4] : {};
          if (!(type === "json")) {
            _context7.n = 3;
            break;
          }
          _context7.n = 1;
          return Promise.resolve(/* import() | convert */).then(__webpack_require__.bind(__webpack_require__, 173));
        case 1:
          _yield$import2 = _context7.v;
          nb2json = _yield$import2.nb2json;
          _context7.n = 2;
          return nb2json(fullFilePath, false, !assetsDir ? false : ["svg", "png", "jpeg", "webp", "gif", "html", "js"], renderOptions);
        case 2:
          _final = _context7.v;
        case 3:
          if (!(_final.assets && _final.assets.length > 0 && assetsDir)) {
            _context7.n = 17;
            break;
          }
          _context7.p = 4;
          _context7.n = 5;
          return external_fs_.promises.mkdir(assetsDir, {
            recursive: true
          });
        case 5:
          // Write each asset file and replace placeholders in content
          _iterator3 = _createForOfIteratorHelper(_final.assets);
          _context7.p = 6;
          _iterator3.s();
        case 7:
          if ((_step3 = _iterator3.n()).done) {
            _context7.n = 12;
            break;
          }
          asset = _step3.value;
          // Ensure data is a string or buffer for hash generation
          dataForHash = Array.isArray(asset.data) ? asset.data.join('') : asset.data; // Generate proper hash for filename
          contentHash = external_crypto_namespaceObject.createHash('md5').update(dataForHash).digest('hex').substring(0, 8); // Use the actual file extension from the asset's placeholderName instead of hardcoding .png
          finalFileName = asset.placeholderName.includes('.') ? asset.placeholderName : "".concat(asset.notebookPrefix || '').concat(((_asset$type = asset.type) === null || _asset$type === void 0 ? void 0 : _asset$type.split('/')[0]) || 'content', "-").concat(contentHash, ".").concat(getExtensionFromType(asset.type));
          assetPath = external_path_.join(assetsDir, finalFileName); // Ensure data is properly formatted for file writing
          dataForWriting = Array.isArray(asset.data) ? asset.data.join('') : asset.data; // For base64 encoded files (images), convert string to buffer
          if (!(asset.encoding === 'base64')) {
            _context7.n = 9;
            break;
          }
          dataForWriting = Buffer.from(dataForWriting, 'base64');
          _context7.n = 8;
          return external_fs_.promises.writeFile(assetPath, dataForWriting);
        case 8:
          _context7.n = 10;
          break;
        case 9:
          _context7.n = 10;
          return external_fs_.promises.writeFile(assetPath, dataForWriting, asset.encoding);
        case 10:
          console.log("Asset saved: ".concat(assetPath));

          // Replace placeholder in content with actual path
          relativePath = "".concat(assetsDir, "/").concat(finalFileName).replace(/^\.\//, '');
          _final.content = _final.content.replace("ASSET_PLACEHOLDER_".concat(asset.placeholderName), relativePath);
        case 11:
          _context7.n = 7;
          break;
        case 12:
          _context7.n = 14;
          break;
        case 13:
          _context7.p = 13;
          _t0 = _context7.v;
          _iterator3.e(_t0);
        case 14:
          _context7.p = 14;
          _iterator3.f();
          return _context7.f(14);
        case 15:
          _context7.n = 17;
          break;
        case 16:
          _context7.p = 16;
          _t1 = _context7.v;
          console.error("Error saving assets:", _t1);
        case 17:
          // Remove assets from final object before saving
          delete _final.assets;
          pyCode = _final.meta.pyCode;
          if (!(pyCode !== null && pyCode !== void 0 && pyCode.length)) {
            _context7.n = 18;
            break;
          }
          file = external_path_.basename(fullFilePath, '.ipynb'); // Extracts filename without extension
          file = file.replace(/^\d{2}_/, ''); // Remove XX_ prefix
          file = _final.meta.default_exp || file; // Use default export name if available

          // Construct the path for Python code file
          pyCodeFilePath = external_path_.join(saveDir, "".concat(file, ".py"));
          txt = pyCode.join('\n').replace(/(^|\n) /g, '$1');
          _context7.n = 18;
          return external_fs_.promises.writeFile(pyCodeFilePath, txt);
        case 18:
          delete _final.meta.pyCode;

          // Save the final file in the specified format
          t = external_path_.join(saveDir, "".concat(_final.meta.filename, ".").concat(type));
          _context7.p = 19;
          _context7.n = 20;
          return external_fs_.promises.writeFile(t, type === "json" ? JSON.stringify(_final) : _final);
        case 20:
          _context7.n = 22;
          break;
        case 21:
          _context7.p = 21;
          _t10 = _context7.v;
          console.log("ERROR writing file:", t);
        case 22:
          return _context7.a(2, _final);
      }
    }, _callee7, null, [[19, 21], [6, 13, 14, 15], [4, 16]]);
  }));
  return _ipynb_publish.apply(this, arguments);
}

;// ./src/cli.js
//#!/usr/bin/env node

/**
 * @description The entry point for the __CLI__ version of ipynb2web. 
 * 
 * Install:
 * ```
 * npm install ipynb2web
 * ``` 
 * Usage: 
 * ```
 * ipynb2web <COMMAND> <SAVETO> <FROM/or/SitemapName>
 * ```
 * 
 * Get help: 
 * ```
 * ipynb2web help
 * ```
 * 
 * It provides a command line interface function that processes given arguments and calls [createSitemap](module-prerender.html#.createSitemap), 
 * [createAudio](module-prerender.html#.createAudio), or [cli_nbs2html](module-prerender.html#.cli_nbs2html), based on the first argument.
 * @module Ipynb2web:cli
 * @exports cli
 * @author Charles Karpati
 */


/**
 * Displays documentation on how to use the CLI when 'help' argument is provided.
 * @memberof module:Ipynb2web:cli
 */
function help() {
  console.log("Usage: ipynb2web <COMMAND> <SAVETO> <FROM/or/SitemapName> [PathPrefix] [Domain]\n    \nCommands:\n  sitemap      Create a sitemap.\n  audio        Create audio assets.\n  help         Display this help message.\n\nFor sitemap command:\n  PathPrefix   Optional prefix to add to all URLs (e.g., '/docs')\n               Example: ipynb2web sitemap ./ ./sitemap.txt /docs\n\n  Domain       Optional domain to prefix all sitemap URLs (e.g., 'https://example.com')\n               Example: ipynb2web sitemap ./ ./sitemap.txt /docs example.com\n\nFor processing notebooks (non-sitemap, non-audio commands):\n  --trusted    Preserve active HTML/JS only for host-approved notebooks.\n               Without this flag, rich content uses inert representations.\n  AssetsDir    Optional directory path for saving static assets separately\n               instead of inlining them. When provided, images and other \n               assets will be saved as separate files in this directory.\n               Example: ipynb2web notebooks ./output ./input '' ./assets\n               \nExamples:\n  ipynb2web help\n  ipynb2web sitemap ./ ./sitemap.txt /docs\n  ipynb2web sitemap ./ ./sitemap.txt /docs example.com\n  ipynb2web audio ./input ./output\n  ipynb2web notebooks ./output ./input\n  ipynb2web notebooks ./output ./input '' ./static-assets\n");
}

/**
 * Command line interface function that processes given arguments and calls the appropriate function based on the first argument.
 *
 * @param {string[]} args - An array of command line arguments.
 * - args[0]: 'Command' - Enter ['sitemap', 'audio'] to create these assets. If neither, it will the value be appended to the SAVETO and FROM paths for processing nb2json on.
 * - args[1]: 'SAVETO' - This directory path, used as a target directory for saving files.
 * - args[2]: 'FROM' - This directory path, used as an output directory for processing files (Whenever args[0] is NOT 'sitemap').
 * - args[2]: 'sitemapFile' - The file path for saving the sitemap (ONLY when args[0] is 'sitemap').
 * - args[3]: 'pathPrefix' - Optional prefix to add to all URLs in the sitemap (ONLY when args[0] is 'sitemap').
 * - args[4]: 'domain' - Optional domain to prefix all URLs in the sitemap (ONLY when args[0] is 'sitemap').
 * - args[4]: 'assetsDir' - Optional directory path for saving static assets separately instead of inlining them (NOT applicable for 'sitemap' and 'audio' commands).
 * @memberof module:Ipynb2web:cli
 */
function cli(args) {
  var trusted = args.includes('--trusted');
  args = args.filter(function (arg) {
    return arg !== '--trusted';
  });
  var directory = args[0] || '';
  var SAVETO = args[1] || false;
  var FROM = args[2] || false;
  var sitemapFile = args[2] || false;
  var pathPrefix = args[3] || '';
  var domain = args[4] || '';
  var assetsDir = args[4] || null;
  console.log('CLI RECEIVED ARGS:'); //, { directory, SAVETO, FROM, sitemapFile, assetsDir });

  /**
   * Based on the first argument, call the appropriate function.
   * If 'sitemap', call createSitemap.
   * If 'audio', call createAudio.
   * Otherwise, call cli_nbs2html.
   */
  if (directory === 'sitemap') {
    // New signature:
    //   ipynb2web sitemap <searchDir> <sitemapFile> [pathPrefix] [domain]
    // Legacy signature (kept for compatibility with older usage):
    //   ipynb2web sitemap '' <sitemapFile> <searchDir> <pathPrefix> [domain]
    var searchDir = SAVETO || './';
    var sitemapOutFile = sitemapFile || './sitemap.txt';
    var sitemapPathPrefix = pathPrefix || '';
    var sitemapDomain = domain || '';
    if ((SAVETO === '' || SAVETO === false) && typeof pathPrefix === 'string' && pathPrefix.trim().startsWith('.') && args[4]) {
      // Your legacy call style puts searchDir in args[3] and pathPrefix in args[4]
      searchDir = args[3] || './';
      sitemapPathPrefix = args[4] || '';
      sitemapDomain = args[5] || '';
    }
    createSitemap(searchDir, sitemapOutFile, sitemapPathPrefix, sitemapDomain);
  } else if (directory === 'audio') {
    createAudio(FROM, SAVETO);
  } else {
    cli_nbs2html(FROM, directory, SAVETO, true, assetsDir, {
      trusted: trusted
    });
  }
}

/**
 * CJS: If this module is the main module (i.e., the script being run), call the cli or help function with the command line arguments.
 */
/*
if (require.main === module) {  }
*/

if ("file:///home/carlos/Documents/GitHub/packages/ipynb2web/src/cli.js".includes('ipynb2web')) {
  var args = process.argv.slice(2);
  if (args[0] === 'help' || args.length === 0) {
    help();
  } else {
    cli(args);
  }
}

// MJS
/* harmony default export */ const src_cli = (cli);
module.exports = __webpack_exports__;
/******/ })()
;