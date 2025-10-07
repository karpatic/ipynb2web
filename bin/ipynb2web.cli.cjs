#!/usr/bin/env node
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 216:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  convertNb: () => (/* binding */ convertNb),
  get_metadata: () => (/* binding */ get_metadata),
  nb2json: () => (/* binding */ nb2json)
});

;// external "marked"
const external_marked_namespaceObject = require("marked");
;// ./src/convert_util.mjs
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
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
  return "<details " + (open ? "open" : "") + "> <summary>Click to toggle</summary> " + content + "</details>";
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
 * Converts special note syntax in a string to HTML elements for displaying notes.
 *
 * @param {string} str - The string containing note syntax to be converted.
 * @returns {string} The string with note syntax converted to HTML elements.
 * @memberof module:convert_util
 */
function convertNotes(str) {
  // console.log("Converting notes", str);
  str = createElement(str);
  str = createInlineFootnotes(str);
  str = createSpans(str);
  return str;
}

//  
// Markdown content will be prefaced with :::{#id .class} 
// Removes 'pre' and 'code' blocks while processing and then reinserts at end.
// check six layers deep. do this by first by creating an array of substrings that are wrapped by an opening and closing 
// ':::' * 6,  then within the resulting arrays, create sub arrays for ':::' * 5, and so on and so on, then handle each 
// one at ':::' * 1 and merge all the results back to the final form.
function createElement(str) {
  // 1. Shield existing <pre>/<code> blocks
  var codeBlocks = [];
  str = str.replace(/<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>/g, function (m) {
    return "__CODE_".concat(codeBlocks.push(m) - 1, "__");
  });

  // helper to build the element
  var buildElement = function buildElement(attrs, content) {
    return "<div".concat(buildAttrs(attrs), ">").concat(content.trim(), "</div>");
  };

  // helper to build id/class string
  var buildAttrs = function buildAttrs(attrs) {
    var idMatch = attrs.match(/#([A-Za-z0-9_-]+)/);
    var classMatches = _toConsumableArray(attrs.matchAll(/\.([A-Za-z0-9_-]+)/g)).map(function (m) {
      return m[1];
    });
    return "".concat(idMatch ? " id=\"".concat(idMatch[1], "\"") : '').concat(classMatches.length ? " class=\"".concat(classMatches.join(' '), "\"") : '');
  };

  // 2. process :::...::: blocks from 6 colons down to 1
  for (var level = 6; level > 0; level--) {
    var colons = ':'.repeat(level);
    var regex = new RegExp("".concat(colons, "\\s*{\\s*([^}]*)}\\s*([\\s\\S]*?)\\s*").concat(colons), 'g');
    str = str.replace(regex, function (_, attrs, content) {
      return buildElement(attrs, content.trim());
    });
  }

  // 3. restore code blocks
  return str.replace(/__CODE_(\d+)__/g, function (_, i) {
    return codeBlocks[i];
  });
}

// test string: 
// "Here is an inline note.^[Inlines notes are easier to write, since you don't have to pick an identifier and move down to type the note.]"
function createInlineFootnotes(str) {
  var count = 0;
  return str.replace(/\^\[([\s\S]+?)\]/g, function (_, text) {
    console.log("Inline note:", text);
    count++;
    var label = "<label tabindex=\"0\" for=\"note".concat(count, "\" class=\"notelbl\">[").concat(count, "]</label>");
    return "<span class=\"note\">\n      <input type=\"checkbox\" id=\"note".concat(count, "\" class=\"notebox\">\n      ").concat(label, "\n      <aside class=\"inline-note\"> \n        ").concat(label, "\n        ").concat(text, "\n      </aside>\n    </span>");
  });
}

// Example: [This text is smallcaps]{.smallcaps #id} 
function createSpans(str) {
  // 1. Shield existing <pre>/<code> blocks
  var codeBlocks = [];
  str = str.replace(/<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>/g, function (m) {
    return "__CODE_".concat(codeBlocks.push(m) - 1, "__");
  });

  // helper to build id/class string
  var buildAttrs = function buildAttrs(attrs) {
    var idMatch = attrs.match(/#([A-Za-z0-9_-]+)/);
    var classMatches = _toConsumableArray(attrs.matchAll(/\.([A-Za-z0-9_-]+)/g)).map(function (m) {
      return m[1];
    });
    return "".concat(idMatch ? " id=\"".concat(idMatch[1], "\"") : '').concat(classMatches.length ? " class=\"".concat(classMatches.join(' '), "\"") : '');
  };

  // 2. replace [text]{attrs} with <span ...>text</span>
  str = str.replace(/\[([^\]]*?)\]\s*\{\s*([^}]*)\}/g, function (_, text, attrs) {
    return "<span".concat(buildAttrs(attrs), ">").concat(text, "</span>");
  });

  // 3. restore code blocks
  return str.replace(/__CODE_(\d+)__/g, function (_, i) {
    return codeBlocks[i];
  });
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

;// ./src/convert.mjs
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = convert_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function convert_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return convert_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? convert_arrayLikeToArray(r, a) : void 0; } }
function convert_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/** 
 *  @fileOverview Houses the core [nb2json](module-convert.html#.nb2json) function and accompanying utils. 
 * Functions exposed from [browser](module-Ipynb2web_browser.html) and [node](module-Ipynb2web_node.html).
 * 
 *  Where processing happens
 * - -1 - Calling nb2json - yaml filename returned gets formatted
 * - 0 - nb2json - meta.filename is fixed up right before returning too
 * - 0 - nb2json - meta.prettify inserts script
 * - 0 - nb2json - replaceEmojies
 * - 0 - nb2json - convertNotes
 * - 1 - get_metadata - yaml is parsed, title, summary, keyValues set
 * 
 *  @module convert
 *  @exports {Object} - An object containing utility functions.
 *  @author Charles Karpati
 */




// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// fname = ./src/ipynb/route/filename (wihout the .ipynb extension, when server calling it)
// fname = /route/filename when from client
// meta.filename = fname UNDERCASED WITH SPACES REPLACED WITH UNDERSCORES.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var prettify = false;
var pyCode = [];
var assetsToWrite = [];
var imageIndex = 0;

/**
 * Converts a Jupyter Notebook (.ipynb) file to a JSON object containing metadata and content as two distinct entries.
 * 
 * @async
 * @param {string} ipynbPath - The path to the Jupyter Notebook file.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @param {string[]|boolean} [extractAssets=false] - Array of asset types to extract (e.g., ['png', 'js', 'txt', 'html']) or boolean for backward compatibility.
 * @returns {Object} An object with metadata and processed content of the notebook.
 * @memberof module:convert
 */
function nb2json(_x) {
  return _nb2json.apply(this, arguments);
}
/**
 * Extracts metadata from the first cell of a Jupyter Notebook, interpreting it as YAML.
 * Get markdown and check EACH LINE for yaml. Special characters must have a space after them.
 * 
 * The Lines: 
 * ```
 * # Title
 * > summary
 * - key1: value1"
 * ```
 * Will return: 
 * ```
 * { title: "Title", summary: "summary", key1: "value1" }
 * ```
 *
 * @param {Object[]} data - An array of cells from a Jupyter Notebook.
 * @returns {Object} An object containing extracted metadata like title, summary, and key-values.
 */
function _nb2json() {
  _nb2json = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(ipynbPath) {
    var verbose,
      extractAssets,
      url,
      ipynb,
      nb,
      meta,
      content,
      resp,
      _args = arguments;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          verbose = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
          extractAssets = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
          pyCode = [];
          prettify = false;
          assetsToWrite = [];
          imageIndex = 0;
          url = ipynbPath;
          if (typeof process !== "undefined" && !ipynbPath.startsWith("http")) {
            url = "http://localhost:8085/".concat(ipynbPath, ".ipynb");
          }
          _context.n = 1;
          return fetch(url, {
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            }
          });
        case 1:
          ipynb = _context.v;
          _context.n = 2;
          return ipynb.json();
        case 2:
          nb = _context.v;
          // console.log('nb', nb);
          meta = get_metadata(nb.cells[0]);
          meta.filename = ipynbPath.split("/")[ipynbPath.split("/").length - 1].toLowerCase().replaceAll(" ", "_");
          verbose && console.log('- get_metadata', meta, '\n');

          // Convert file 
          content = convertNb(nb.cells.slice(1), meta, verbose, extractAssets, meta.filename).flat().join(" ");
          verbose && pyCode.length && console.log({
            pyCode: pyCode
          });
          meta.pyCode = pyCode;
          (meta.prettify || prettify) && (content += "\n  <script src=\"https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js\"></script>\n  <link rel=\"stylesheet\" href=\"https://cdn.rawgit.com/google/code-prettify/master/styles/desert.css\"/>\n  ");

          // verbose && console.log('- - content Ran ~~~~~~~~~~~', content, '~~~~~~~~~~~\n');
          resp = replaceEmojis(content);
          verbose && console.log('- - replaceEmojis Ran', '\n');
          return _context.a(2, {
            meta: meta,
            content: resp,
            assets: assetsToWrite
          });
      }
    }, _callee);
  }));
  return _nb2json.apply(this, arguments);
}
function get_metadata(data) {
  var returnThis = {};
  var _iterator = _createForOfIteratorHelper(data.source),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var line = _step.value;
      if (line.startsWith("#")) {
        returnThis.title = line.replaceAll("\n", "").replaceAll("# ", "", 2);
      } else if (line.startsWith(">")) {
        returnThis.summary = line.replaceAll("\n", "").replaceAll("> ", "", 1);
      } else if (line.startsWith("-")) {
        var key = line.slice(line.indexOf("- ") + 2, line.indexOf(": "));
        var val = line.slice(line.indexOf(": ") + 2).replaceAll("\n", "").trim();
        returnThis[key] = val;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return returnThis;
}

/**
 * Processes each cell of a Jupyter Notebook and returns an array of converted content.
 *
 * @param {Object[]} cells - An array of cells from a Jupyter Notebook.
 * @param {Object} meta - Metadata associated with the notebook.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @param {string[]|boolean} [extractAssets=false] - Array of asset types to extract (e.g., ['png', 'js', 'txt', 'html']) or boolean for backward compatibility.
 * @param {string} [notebookName=null] - The name of the notebook for asset naming.
 * @returns {string[]} An array of strings representing the processed content of each cell.
 */
function convertNb(cells, meta) {
  var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var extractAssets = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var notebookName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  verbose && console.group('- convertNb Running');
  var returnThis = cells.map(function (c) {
    return cleanCell(c, meta, verbose, extractAssets, notebookName);
  });
  verbose && console.groupEnd();
  return returnThis;
}

/**
 * Processes an individual cell from a Jupyter Notebook, handling either markdown or code cells.
 * Returns text or passes cell to 'code cell' processor
 *
 * @param {Object} cell - A cell from a Jupyter Notebook.
 * @param {Object} meta - Metadata associated with the notebook.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @param {string[]|boolean} [extractAssets=false] - Array of asset types to extract (e.g., ['png', 'js', 'txt', 'html']) or boolean for backward compatibility.
 * @param {string} [notebookName=null] - The name of the notebook for asset naming.
 * @returns {string} The processed content of the cell.
 */
function cleanCell(cell, meta) {
  var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var extractAssets = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var notebookName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var x;
  if (cell["cell_type"] == "markdown") {
    x = processMarkdown(cell["source"].join(" "));
    // verbose && console.log('- - - Parsing Markdown', x);
  } else {
    // verbose && console.log('- - Parsing Code');//, cell ,'\n'); 
    x = processCode(cell, meta, verbose, extractAssets, notebookName);
  }
  return x;
}

/**
 * Processes markdown content, converting it to HTML, handling special syntax, and applying transformations.
 *
 * @param {string} x - The markdown content to be processed.
 * @returns {string} The processed HTML content.
 */
function processMarkdown(txt) {
  // Does not process markdown wrapped in html
  var x = (0,external_marked_namespaceObject.marked)(txt);

  // Two spaces at lines end transform into line breaks 
  x = x.replace(/\s{2,}<\/p>/g, "</p><br>");

  // Remove newline chars even though they dont get rendered. 
  // x = x.replace(/\n/g, '');

  // replace code blocks with pre.prettyprint
  x = replaceAndLog(x, /<pre><code>([\s\S]*?)<\/code><\/pre>/g, function (match, content) {
    prettify = true;
    return "<pre class='prettyprint'>".concat(content, "</pre>");
  });

  // Single line code blocks do NOT get prettified
  // x = replaceAndLog(x, /<code>([\s\S]*?)<\/code>/g, (match, content) => { prettify = true; return `<pre class='prettyprint' style='display:inline'>${content}</pre>`; });

  // Open links in new tab
  x = replaceAndLog(x, /<a\s+(?:[^>]*?\s+)?href="(.*?)"/g, function (match, href) {
    if (!href.startsWith("./")) {
      match += ' target="_blank" rel="nosopener noreferrer nofollow"';
    }
    return match;
  });

  // x = createSpans(createInlineFootnotes(createElement(str))
  x = convertNotes(x);
  return x;
}

/**
 * Processes a code cell from a Jupyter Notebook, applying various transformations based on flags and output type.
 * 
 * Calls [getFlags](module-convert.html#.getFlags), [processSource](module-convert.html#.processSource), [processOutput](module-convert.html#.processOutput)
 *
 * @param {Object} cell - A code cell from a Jupyter Notebook.
 * @param {Object} meta - Metadata associated with the notebook.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @param {string[]|boolean} [extractAssets=false] - Array of asset types to extract (e.g., ['png', 'js', 'txt', 'html']) or boolean for backward compatibility.
 * @param {string} [notebookName=null] - The name of the notebook for asset naming.
 * @returns {string[]} An array of strings representing the processed content of the code cell.
 */
function processCode(cell, meta) {
  var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var extractAssets = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var notebookName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  // verbose && console.log('- - - processCode Running');
  var x = [];
  var flags = [];
  // source
  // verbose && console.group('ProcessCode');
  if (cell["source"].length) {
    var source = cell["source"];
    flags = getFlags(source[0]);
    // verbose && console.log('Input: ', {'Raw': cell['source'], 'Flags': flags } ) 
    if (flags.length > 0) {
      source = source.slice(1);
    }
    source = processSource(source.join(" "), flags, meta);
    x.push(source);
  }
  // output
  if (cell["outputs"].length) {
    // verbose && console.log(flags, cell['outputs']) 
    var _iterator2 = _createForOfIteratorHelper(cell["outputs"]),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var o = _step2.value;
        x.push(processOutput(o, flags, verbose, extractAssets, notebookName));
      }
      // clear_output();
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
  // verbose && console.groupEnd();
  return x;
}

/**
 * Detects special flags in the source code of a notebook cell and handles them accordingly.
 *
 * @memberof module:convert
 * @param {string} source - The source code of a notebook cell.
 * @returns {string[]} An array of detected flags in the cell's source code.
 */
function getFlags(source) {
  var input_aug = ["#collapse_input_open", "#collapse_input", "#collapse_output_open", "#collapse_output", "#hide_input", "#hide_output", "#hide", "%%capture", "%%javascript", "%%html", "#export"];
  var sourceFlags = source.split(/\s+/); // Split by whitespace
  return input_aug.filter(function (x) {
    return sourceFlags.includes(x);
  });
}

/**
 * Processes the source of a code cell, applying transformations based on flags and metadata.
 * Strip Flags from text, make details, hide all. Append to pyCode
 *
 * @memberof module:convert
 * @param {string} source - The source code of a notebook cell.
 * @param {string[]} flags - An array of flags affecting the processing.
 * @param {Object} meta - Metadata associated with the notebook.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {string} The processed source code.
 */
function processSource(source, flags, meta) {
  var verbose = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if ('#export' == flags[flags.length - 1]) {
    pyCode.push(source);
  }
  var _iterator3 = _createForOfIteratorHelper(flags),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _lbl = _step3.value;
      var skipList = ["#hide", "#hide_input", "%%javascript", "%%html", "%%capture"];
      if (skipList.includes(_lbl)) {
        return "";
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  if (meta.prettify) {
    source = "<pre class='prettyprint'>".concat(source, "</pre>");
  }
  var flagg = flags && !!flags.includes('#collapse_input_open');
  if (flagg) {
    verbose && console.log(flags);
    var _iterator4 = _createForOfIteratorHelper(flags),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var lbl = _step4.value;
        source = source.replaceAll(lbl + "\r\n", "");
        source = source.replaceAll(lbl + "\n", ""); // Strip the Flag  
        if (lbl == "#collapse_input_open") source = makeDetails(source, true);else if (lbl == "#collapse_input") source = makeDetails(source, false);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    return source;
  }
}

/**
 * Processes the output of a code cell, applying transformations based on flags and output type.
 * Strip Flags from output, make details, hide all.
 *
 * @function processOutput
 * @memberof module:convert
 * @param {Object} source - The output of a code cell.
 * @param {string[]} flags - An array of flags affecting the processing.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @param {string[]|boolean} [extractAssets=false] - Array of asset types to extract (e.g., ['png', 'js', 'txt', 'html']) or boolean for backward compatibility.
 * @param {string} [notebookName=null] - The name of the notebook for asset naming.
 * @returns {string} The processed output content.
 */
function processOutput(source, flags) {
  var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var extractAssets = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var notebookName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  // console.log('processOutput', source);
  if (source["output_type"] == "error") {
    return "";
  }
  if (source["output_type"] == "stream") {
    if (source["name"] == "stderr") {
      return "";
    }
    source["data"] = {
      "text/html": source["text"]
    };
  }
  var keys = Object.keys(source["data"]);

  // Debug logging to see what's happening
  if (verbose || extractAssets) {
    console.log('processOutput debug:', {
      keys: keys,
      data: source["data"],
      hasTextHtml: keys.includes("text/html"),
      hasTextPlain: keys.includes("text/plain"),
      hasAppJs: keys.includes("application/javascript"),
      imageKeys: keys.filter(function (k) {
        return k.startsWith('image/');
      })
    });
  }
  var shouldExtract = function shouldExtract(type) {
    var result = extractAssets === true || Array.isArray(extractAssets) && extractAssets.some(function (t) {
      return t.toLowerCase() === type || t.toLowerCase() === type.split('/')[1] || type === 'application/javascript' && t.toLowerCase() === 'js' || type === 'text/html' && t.toLowerCase() === 'html';
    });

    // Debug logging for shouldExtract
    if ((verbose || extractAssets) && (type === 'text/html' || type === 'application/javascript')) {
      console.log('shouldExtract debug:', {
        type: type,
        extractAssets: extractAssets,
        result: result,
        isArray: Array.isArray(extractAssets)
      });
    }
    return result;
  };
  if (keys.includes("text/html")) {
    var data = source["data"]["text/html"];
    source = Array.isArray(data) ? data.join("") : data;

    // Calculate size in bytes
    var sizeInBytes = new TextEncoder().encode(source).length;
    var sizeThreshold = 100 * 1024; // 100KB

    // Only extract if starts with doctype, <html>, or is larger than 100KB
    var startsWithDoctype = source.toLowerCase().includes('<!doctype');
    var startsWithHtml = source.toLowerCase().trim().startsWith('<html');
    var isLargeEnough = sizeInBytes > sizeThreshold;
    if (shouldExtract('text/html') && typeof process !== "undefined" && (startsWithDoctype || startsWithHtml || isLargeEnough)) {
      var hash = source.substring(0, 8).replace(/[^a-zA-Z0-9]/g, '');
      var name = "".concat(notebookName ? "".concat(notebookName, "-") : '', "content-").concat(hash, ".html");

      // Debug: Log what's being extracted as HTML
      if (verbose || extractAssets) {
        console.log('Extracting HTML asset:', {
          name: name,
          dataLength: source.length,
          sizeInBytes: sizeInBytes,
          startsWithDoctype: startsWithDoctype,
          startsWithHtml: startsWithHtml,
          isLargeEnough: isLargeEnough,
          hash: hash
        });
      }
      assetsToWrite.push({
        placeholderName: name,
        data: source,
        encoding: 'utf8',
        type: 'text/html',
        notebookPrefix: notebookName ? "".concat(notebookName, "-") : ''
      });
      source = "<iframe src=\"ASSET_PLACEHOLDER_".concat(name, "\" width=\"100%\" height=\"400px\"></iframe>");
    }
  } else if (keys.includes("application/javascript")) {
    var _data = source["data"]["application/javascript"];

    // Calculate size in bytes for JS content
    var jsContent = Array.isArray(_data) ? _data.join("") : _data;
    var _sizeInBytes = new TextEncoder().encode(jsContent).length;
    var _sizeThreshold = 100 * 1024; // 100KB
    var _isLargeEnough = _sizeInBytes > _sizeThreshold;
    if (shouldExtract('application/javascript') && typeof process !== "undefined" && _isLargeEnough) {
      var _hash = jsContent.toString().substring(0, 8).replace(/[^a-zA-Z0-9]/g, '');
      var _name = "".concat(notebookName ? "".concat(notebookName, "-") : '', "script-").concat(_hash, ".js");

      // Debug: Log what's being extracted as JS
      if (verbose || extractAssets) {
        console.log('Extracting JS asset:', {
          name: _name,
          sizeInBytes: _sizeInBytes,
          isLargeEnough: _isLargeEnough
        });
      }
      assetsToWrite.push({
        placeholderName: _name,
        data: jsContent,
        encoding: 'utf8',
        type: 'application/javascript'
      });
      source = "<script src=\"ASSET_PLACEHOLDER_".concat(_name, "\"></script>");
    } else {
      source = "<script>" + jsContent + "</script>";
    }
  } else {
    // Check for images first, then fall back to text/plain if no image found
    var imageKey = keys.filter(function (key) {
      return key.startsWith('image/');
    })[0];
    if (imageKey && source["data"][imageKey]) {
      var _data2 = source["data"][imageKey];

      // Debug logging for image processing
      if (verbose || extractAssets) {
        console.log('Image processing debug:', {
          imageKey: imageKey,
          dataType: _typeof(_data2),
          dataLength: _data2 === null || _data2 === void 0 ? void 0 : _data2.length,
          shouldExtractResult: shouldExtract(imageKey),
          processEnv: typeof process !== "undefined"
        });
      }

      // Additional check to make sure this is actually image data
      if (typeof _data2 === 'string' && _data2.length > 50) {
        // Basic sanity check for image data
        var imageType = imageKey.split('/')[1]; // Extract format (png, jpeg, gif, svg+xml, etc.)

        if (shouldExtract(imageKey) && typeof process !== "undefined") {
          // Use simple index-based naming instead of complex unique ID
          imageIndex++;

          // Handle special cases for file extensions
          var extension = imageType;
          if (imageType === 'jpeg') extension = 'jpg';
          if (imageType === 'svg+xml') extension = 'svg';
          var _name2 = "".concat(notebookName ? "".concat(notebookName, "-") : '', "image-").concat(imageIndex, ".").concat(extension);
          var encoding = imageType === 'svg+xml' ? 'utf8' : 'base64';

          // Debug: Log what's being extracted as image
          if (verbose || extractAssets) {
            console.log('Extracting image asset:', {
              name: _name2,
              imageType: imageType,
              extension: extension,
              encoding: encoding,
              dataLength: _data2.length,
              imageIndex: imageIndex
            });
          }
          assetsToWrite.push({
            placeholderName: _name2,
            data: _data2,
            encoding: encoding,
            type: imageKey,
            notebookPrefix: notebookName ? "".concat(notebookName, "-") : ''
          });
          source = "<img src=\"ASSET_PLACEHOLDER_".concat(_name2, "\" alt=\"Image Alt Text\">");
        } else {
          if (verbose || extractAssets) {
            console.log('Image not extracted - inline instead:', {
              shouldExtract: shouldExtract(imageKey),
              processUndefined: typeof process === "undefined"
            });
          }
          source = "<img src=\"data:".concat(imageKey, ";base64,").concat(_data2, "\" alt=\"Image Alt Text\">");
        }
      } else {
        // If we reach here, there was an image key but no valid image data
        if (verbose || extractAssets) {
          console.log('Found image key but invalid data:', {
            imageKey: imageKey,
            dataType: _typeof(_data2),
            dataLength: _data2 === null || _data2 === void 0 ? void 0 : _data2.length
          });
        }
        source = "";
      }
    } else if (keys.includes("text/plain")) {
      var _data3 = source["data"]["text/plain"];
      // Always keep text/plain inline, don't extract to separate files
      source = !/<Figure/.test(_data3) ? Array.isArray(_data3) ? _data3.join('') : _data3 : "";
    } else {
      // No recognized content type found
      if (verbose || extractAssets) {
        console.log('No recognized content type found:', {
          keys: keys,
          availableData: Object.keys(source["data"])
        });
      }
      source = "";
    }
  }
  var _iterator5 = _createForOfIteratorHelper(flags),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var lbl = _step5.value;
      try {
        source = source.replaceAll(lbl + "\r\n", "");
        source = source.replaceAll(lbl + "\n", "");
      } catch (_unused) {
        verbose && console.log("ERROR: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!processOutput... ", _typeof(source), source);
      }
      if (lbl == "#collapse_output_open") {
        source = makeDetails(source, true);
      }
      if (lbl == "#collapse_output") {
        source = makeDetails(source, false);
      }
      if (lbl == "#hide_output") {
        source = "";
      }
      if (lbl == "#hide") {
        source = "";
      }
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  return source;
  //output_type == 'stream' ==> text
  //output_type == 'display_data' ==> data{'application/javascript' or 'text/html' or 'execute_result'}
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
      verbose,
      pages,
      _args2 = arguments,
      _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          search = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : './';
          sitemapFile = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : './sitemap.txt';
          pathPrefix = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : '';
          verbose = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : true;
          verbose && console.log("\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ START createSitemap \n\n");
          _context2.n = 1;
          return processDirectory(search, '', pathPrefix, verbose);
        case 1:
          pages = _context2.v;
          console.log('pages', pages);
          _context2.p = 2;
          _context2.n = 3;
          return external_fs_.promises.writeFile(sitemapFile, pages.join('\n') + '\n');
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
              var filePath, jsonData, _t2;
              return _regenerator().w(function (_context3) {
                while (1) switch (_context3.n) {
                  case 0:
                    filePath = external_path_.join(directory, file);
                    _t2 = JSON;
                    _context3.n = 1;
                    return external_fs_.promises.readFile(filePath, 'utf-8');
                  case 1:
                    jsonData = _t2.parse.call(_t2, _context3.v);
                    jsonData.forEach(function (obj) {
                      if (obj.filename) {
                        var url = "/".concat(file.split('_')[0].split('.')[0], "/").concat(subdir ? subdir + '/' : '').concat(obj.filename);
                        pages.push(pathPrefix ? pathPrefix + url : url);
                      }
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
      stat,
      pages,
      _args5 = arguments;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          verbose = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : false;
          assetsDir = _args5.length > 4 && _args5[4] !== undefined ? _args5[4] : null;
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
          // filename without extension 
          generate_sectionmap(pages, FROM, directory, SAVETO, verbose, assetsDir);
        case 4:
          return _context5.a(2);
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
          return ipynb_publish("".concat(FROM).concat(directory), SAVETO, "json", assetsDir);
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
          return ipynb_publish("".concat(FROM).concat(directory, "/").concat(page), "".concat(SAVETO).concat(directory), "json", assetsDir);
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
          if (!(type === "json")) {
            _context7.n = 3;
            break;
          }
          _context7.n = 1;
          return Promise.resolve(/* import() | convert */).then(__webpack_require__.bind(__webpack_require__, 216));
        case 1:
          _yield$import2 = _context7.v;
          nb2json = _yield$import2.nb2json;
          _context7.n = 2;
          return nb2json(fullFilePath, false, !assetsDir ? false : ["svg", "png", "jpeg", "webp", "gif", "html", "js"]);
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
  console.log("Usage: ipynb2web <COMMAND> <SAVETO> <FROM/or/SitemapName> [PathPrefix]\n    \nCommands:\n  sitemap      Create a sitemap.\n  audio        Create audio assets.\n  help         Display this help message.\n\nFor sitemap command:\n  PathPrefix   Optional prefix to add to all URLs (e.g., '/docs')\n               Example: ipynb2web sitemap ./ ./sitemap.txt /docs\n\nFor processing notebooks (non-sitemap, non-audio commands):\n  AssetsDir    Optional directory path for saving static assets separately\n               instead of inlining them. When provided, images and other \n               assets will be saved as separate files in this directory.\n               Example: ipynb2web notebooks ./output ./input '' ./assets\n               \nExamples:\n  ipynb2web help\n  ipynb2web sitemap ./ ./sitemap.txt /docs\n  ipynb2web audio ./input ./output\n  ipynb2web notebooks ./output ./input\n  ipynb2web notebooks ./output ./input '' ./static-assets\n");
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
 * - args[4]: 'assetsDir' - Optional directory path for saving static assets separately instead of inlining them (NOT applicable for 'sitemap' and 'audio' commands).
 * @memberof module:Ipynb2web:cli
 */
function cli(args) {
  var directory = args[0] || '';
  var SAVETO = args[1] || false;
  var FROM = args[2] || false;
  var sitemapFile = args[2] || false;
  var pathPrefix = args[3] || '';
  var assetsDir = args[4] || null;
  console.log('CLI RECEIVED ARGS:'); //, { directory, SAVETO, FROM, sitemapFile, assetsDir });

  /**
   * Based on the first argument, call the appropriate function.
   * If 'sitemap', call createSitemap.
   * If 'audio', call createAudio.
   * Otherwise, call cli_nbs2html.
   */
  if (directory === 'sitemap') {
    createSitemap(SAVETO || './', sitemapFile || './sitemap.txt', pathPrefix);
  } else if (directory === 'audio') {
    createAudio(FROM, SAVETO);
  } else {
    cli_nbs2html(FROM, directory, SAVETO, true, assetsDir);
  }
}

/**
 * CJS: If this module is the main module (i.e., the script being run), call the cli or help function with the command line arguments.
 */
/*
if (require.main === module) {  }
*/

if ("file:///home/carlos/Documents/GitHub/ipynb2web/src/cli.js".includes('ipynb2web')) {
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