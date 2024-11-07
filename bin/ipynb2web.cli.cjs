/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 383:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

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

;// CONCATENATED MODULE: external "marked"
const external_marked_namespaceObject = require("marked");
;// CONCATENATED MODULE: ./src/convert_util.mjs
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
  var matchCount = 0;
  var regex = /(<p)(.*?)\(\(\((.*?)::(.*?)\)\)\)(.*?)(<\/p>)/g;
  var replacement = function replacement(_, p1, p2, key, value, p4, p5) {
    matchCount++;
    var pStart = ""; // style='display:inline' ";
    var lbl = "<label ".concat(pStart, " tabindex=\"0\" for='note").concat(matchCount, "' class='notelbl'>[").concat(matchCount, "]</label>");
    var fin = "<div>\n      <input type='checkbox' id='note".concat(matchCount, "' class='notebox'>\n      ").concat(p1).concat(pStart).concat(p2).concat(lbl).concat(p4).concat(p5, "\n      <aside>").concat(lbl, " ").concat(value, " </aside> \n    </div>");
    return fin;
  };
  return str.replace(regex, replacement);
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

;// CONCATENATED MODULE: ./src/convert.mjs
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/** 
 *  @fileOverview Houses the core [nb2json](module-convert.html#.nb2json) function and accompanying utils. 
 * Functions exposed from [browser](module-browser.html) and [node](module-node.html).
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

/**
 * Converts a Jupyter Notebook (.ipynb) file to a JSON object containing metadata and content as two distinct entries.
 * 
 * @async
 * @param {string} ipynbPath - The path to the Jupyter Notebook file.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
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
  _nb2json = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(ipynbPath) {
    var verbose,
      url,
      ipynb,
      nb,
      meta,
      content,
      resp,
      _args = arguments;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          verbose = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
          pyCode = [];
          prettify = false;
          url = ipynbPath;
          if (typeof process !== "undefined" && !ipynbPath.startsWith("http")) {
            url = "http://localhost:8085/".concat(ipynbPath, ".ipynb");
          }
          _context.next = 7;
          return fetch(url, {
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            }
          });
        case 7:
          ipynb = _context.sent;
          _context.next = 10;
          return ipynb.json();
        case 10:
          nb = _context.sent;
          meta = get_metadata(nb.cells[0]);
          meta.filename = ipynbPath.split("/")[ipynbPath.split("/").length - 1].toLowerCase().replaceAll(" ", "_");
          verbose && console.log('- get_metadata', meta, '\n');

          // Convert file 
          content = convertNb(nb.cells.slice(1), meta).flat().join(" ");
          verbose && pyCode.length && console.log({
            pyCode: pyCode
          });
          meta.pyCode = pyCode;
          (meta.prettify || prettify) && (content += "\n  <script src=\"https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js\"></script>\n  <link rel=\"stylesheet\" href=\"https://cdn.rawgit.com/google/code-prettify/master/styles/desert.css\"/>\n  ");
          verbose && console.log('- - content Ran ~~~~~~~~~~~', content, '~~~~~~~~~~~\n');
          resp = replaceEmojis(content);
          verbose && console.log('- - replaceEmojis Ran', '\n');
          return _context.abrupt("return", {
            meta: meta,
            content: resp
          });
        case 22:
        case "end":
          return _context.stop();
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
 * @returns {string[]} An array of strings representing the processed content of each cell.
 */
function convertNb(cells, meta) {
  var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  verbose && console.log('- convertNb Running');
  return cells.map(function (c) {
    return cleanCell(c, meta);
  });
}

/**
 * Processes an individual cell from a Jupyter Notebook, handling either markdown or code cells.
 * Returns text or passes cell to 'code cell' processor
 *
 * @param {Object} cell - A cell from a Jupyter Notebook.
 * @param {Object} meta - Metadata associated with the notebook.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {string} The processed content of the cell.
 */
function cleanCell(cell, meta) {
  var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  verbose && console.log('- - cleanCell Running'); //, cell ,'\n'); 
  var x;
  if (cell["cell_type"] == "markdown") {
    verbose && console.log('- - - Parsing Markdown');
    x = processMarkdown(cell["source"].join(" "));
  } else {
    x = processCode(cell, meta);
  }
  return x;
}

/**
 * Processes markdown content, converting it to HTML, handling special syntax, and applying transformations.
 *
 * @param {string} x - The markdown content to be processed.
 * @returns {string} The processed HTML content.
 */
function processMarkdown(x) {
  // check if matches regex: (((key1::value1))) and replace with aside
  x = x.replace(/\(\(\((.*?)::(.*?)\)\)\)/g, function (match, key, value) {
    if (key == 'note') {
      return match;
    }
    return "<aside class=\"".concat(key, "\">").concat(value, "</aside>");
  });
  x = external_marked_namespaceObject.marked.parse(x);

  // wrap li's in a div or p
  x = x.replace(/<li>(.*?)<\/li>/g, function (match, innerContent) {
    var containsBlockLevel = /<(p|div|blockquote|pre|hr|form)/.test(innerContent);
    var returnThis = "<li>".concat(containsBlockLevel ? "<div>".concat(innerContent, "</div>") : "<p>".concat(innerContent, "</p>"), "</li>");
    return returnThis;
  });

  // replace code blocks with pre.prettyprint
  x = replaceAndLog(x, /<pre><code>([\s\S]*?)<\/code><\/pre>/g, function () {
    prettify = true;
    "<pre class='prettyprint'>$1</pre>";
  });
  x = replaceAndLog(x, /<code>([\s\S]*?)<\/code>/g, function () {
    prettify = true;
    "<pre class='prettyprint'>$1</pre>";
  });

  // local redirects pingServer
  x = replaceAndLog(x, /<a\s+(?:[^>]*?\s+)?href="(.*?)"/g, function (match, href) {
    // open links in new tab
    if (!href.startsWith("./")) {
      match += ' onclick="window.pingServer(this)" target="_blank" rel="noopener noreferrer nofollow"';
    }
    return match;
  });
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
 * @returns {string[]} An array of strings representing the processed content of the code cell.
 */
function processCode(cell, meta) {
  var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  verbose && console.log('- - - processCode Running');
  var x = [];
  var flags = [];
  // source
  if (cell["source"].length) {
    verbose && console.log('- - - - Raw Input Source', cell['source']);
    var source = cell["source"];
    flags = getFlags(source[0]);
    verbose && console.log('- - - - - Flags: ', flags);
    if (flags.length > 0) {
      source = source.slice(1);
    }
    source = processSource(source.join(" "), flags, meta);
    x.push(source);
  }
  // output
  if (cell["outputs"].length) {
    verbose && console.log('- - - - Raw Process Outputs', cell['outputs']);
    var _iterator2 = _createForOfIteratorHelper(cell["outputs"]),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var o = _step2.value;
        x.push(processOutput(o, flags));
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    verbose && console.log('- - - - - processOutput: ', x);
    // clear_output();
  }
  verbose && console.log('- - - processCode Ran');
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
 * @returns {string} The processed output content.
 */
function processOutput(source, flags) {
  var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
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
  if (keys.includes("text/html")) {
    source = source["data"]["text/html"];
    source = source.join("");
  } else if (keys.includes("application/javascript")) {
    source = "<script>" + source["data"]["application/javascript"] + "</script>";
  } else if (keys.includes("image/png")) {
    source = '<img src="data:image/png;base64,' + source["data"]["image/png"] + "\" alt='Image Alt Text'>";
  } else if (keys.includes("text/plain")) {
    source = !/<Figure/.test(source["data"]["text/plain"]) ? source["data"]["text/plain"] : "";
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
        verbose && console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!processOutput... ", _typeof(source), source);
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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * @fileOverview Provides functionalities for generating audio content from text and JSON data using OpenAI's APIs. 
 * 
 * This module contains functions for creating speech from text input, saving audio files, extracting text from JSON for speech synthesis, and converting JSON data to audio files in a specified directory. It leverages OpenAI's text-to-speech and GPT-4 models to process and convert textual content into spoken audio, supporting various customization options like voice model and speech speed. 
 * 
 * Functions exposed from [cli](module-cli.html) and [node](module-node.html).
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
  _createSpeech = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(input, apikey) {
    var voice,
      speed,
      model,
      verbose,
      openai,
      mp3Response,
      buffer,
      _args = arguments;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          voice = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'echo';
          speed = _args.length > 3 && _args[3] !== undefined ? _args[3] : 1.0;
          model = _args.length > 4 && _args[4] !== undefined ? _args[4] : 'tts-1';
          verbose = _args.length > 5 && _args[5] !== undefined ? _args[5] : false;
          if (!apikey) {
            apikey = process.env.OPENAI_API_KEY;
          }
          if (apikey) {
            _context.next = 8;
            break;
          }
          verbose && console.log('No API Key provided and \"env.OPENAI_API_KEY\" not found.');
          return _context.abrupt("return");
        case 8:
          _context.prev = 8;
          openai = new OpenAI(apikey); // Speed [ `0.25` - `4.0`]. default = `1.0`. 
          // The maximum length is 4096 characters.
          _context.next = 12;
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
        case 12:
          mp3Response = _context.sent;
          _context.next = 15;
          return mp3Response.buffer();
        case 15:
          buffer = _context.sent;
          _context.next = 22;
          break;
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](8);
          verbose && console.log('createSpeech error', _context.t0);
          return _context.abrupt("return");
        case 22:
          return _context.abrupt("return", buffer);
        case 23:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[8, 18]]);
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
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {string|null} The extracted text from the JSON object, or null if an error occurs or no API key is provided.
 * @throws {Error} Logs an error to the console if there is an error in fetching or processing the request and verbose is true.
 * @memberof module:create_audio
 */
function _saveSpeech() {
  _saveSpeech = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(mp3SaveFilePath, buffer) {
    var verbose,
      _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          verbose = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : false;
          _context2.prev = 1;
          _context2.next = 4;
          return fs__WEBPACK_IMPORTED_MODULE_0__.promises.writeFile(mp3SaveFilePath, buffer);
        case 4:
          verbose && console.log("Audio saved to ".concat(mp3SaveFilePath));
          _context2.next = 10;
          break;
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](1);
          verbose && console.log('saveSpeech error', _context2.t0);
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 7]]);
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
  _getTextFromJson = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(json, apikey) {
    var verbose,
      text,
      requestBody,
      response,
      _data,
      responseData,
      _args3 = arguments;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          verbose = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : false;
          if (!apikey) {
            apikey = process.env.OPENAI_API_KEY;
          }
          if (apikey) {
            _context3.next = 5;
            break;
          }
          verbose && console.log('No API Key provided and \"env.OPENAI_API_KEY\" not found.');
          return _context3.abrupt("return");
        case 5:
          _context3.prev = 5;
          text = !json.title ? '' : "Title:   ".concat(json.title, " \n ");
          text += !json.summary ? '' : "Summary: ".concat(json.summary, " \n ");
          text += "Content: ".concat(JSON.stringify(json.content));
          requestBody = {
            model: "gpt-4-1106-preview",
            messages: [{
              "role": "system",
              "content": "\nYou are an assistant to a webpage to audio service. \nYou will be given a webpage you must convert it to a form of text ready for reading aloud.\nStart every conversion with a statement \"You are listening to the audio version of this webpage\" followed by the title and summary.\nUnder no circumstances should code be read and should be paraphrased or skipped. \n"
            }, {
              "role": "user",
              "content": text
            }]
          };
          _context3.next = 12;
          return fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': "Bearer ".concat(apikey),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });
        case 12:
          response = _context3.sent;
          _context3.next = 15;
          return response.json();
        case 15:
          responseData = _context3.sent;
          _data = responseData.choices[0].message.content;
          _context3.next = 23;
          break;
        case 19:
          _context3.prev = 19;
          _context3.t0 = _context3["catch"](5);
          verbose && console.log('getTextFromJson error', _context3.t0);
          return _context3.abrupt("return");
        case 23:
          return _context3.abrupt("return", data);
        case 24:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[5, 19]]);
  }));
  return _getTextFromJson.apply(this, arguments);
}
function speechFromDir(_x7, _x8, _x9) {
  return _speechFromDir.apply(this, arguments);
}
function _speechFromDir() {
  _speechFromDir = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(fromFolder, toFolder, apikey) {
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
      _args4 = arguments;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          verbose = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : false;
          if (!apikey) {
            apikey = process.env.OPENAI_API_KEY;
          }
          if (apikey) {
            _context4.next = 5;
            break;
          }
          verbose && console.log('No API Key provided and \"env.OPENAI_API_KEY\" not found.');
          return _context4.abrupt("return");
        case 5:
          _context4.prev = 5;
          files = fs__WEBPACK_IMPORTED_MODULE_0__.readdirSync(fromFolder);
          i = 0;
        case 8:
          if (!(i < files.length)) {
            _context4.next = 31;
            break;
          }
          filename = path__WEBPACK_IMPORTED_MODULE_1__.join(fromFolder, files[i]);
          stat = fs__WEBPACK_IMPORTED_MODULE_0__.lstatSync(filename);
          if (!stat.isDirectory()) {
            _context4.next = 15;
            break;
          }
          speechFromDir(filename, toFolder); //recurse
          _context4.next = 28;
          break;
        case 15:
          if (!(filename.indexOf('.json') >= 0)) {
            _context4.next = 28;
            break;
          }
          file = fs__WEBPACK_IMPORTED_MODULE_0__.readFileSync(filename, 'utf8');
          json = JSON.parse(file);
          if (!(json !== null && json !== void 0 && (_json$meta = json.meta) !== null && _json$meta !== void 0 && _json$meta.audio)) {
            _context4.next = 28;
            break;
          }
          _context4.next = 21;
          return getTextFromJson(json);
        case 21:
          text = _context4.sent;
          _context4.next = 24;
          return createSpeech(text, apikey);
        case 24:
          buffer = _context4.sent;
          _file = files[i].substring(0, files[i].length - 5); // console.log('file', file)
          savePath = path__WEBPACK_IMPORTED_MODULE_1__.join(toFolder, _file) + '.mp3'; // console.log('savePath', savePath)
          saveSpeech(savePath, buffer);
        case 28:
          i++;
          _context4.next = 8;
          break;
        case 31:
          _context4.next = 37;
          break;
        case 33:
          _context4.prev = 33;
          _context4.t0 = _context4["catch"](5);
          verbose && console.log('speechFromDir error', _context4.t0);
          return _context4.abrupt("return");
        case 37:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[5, 33]]);
  }));
  return _speechFromDir.apply(this, arguments);
}


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
;// CONCATENATED MODULE: external "http-server"
const external_http_server_namespaceObject = require("http-server");
;// CONCATENATED MODULE: ./src/prerender.mjs
var _excluded = ["csp", "sitemap", "breadcrumbs", "badges", "keywords", "comments", "hide", "image", "toc", "title"],
  _excluded2 = ["csp", "sitemap", "breadcrumbs", "badges", "keywords", "comments", "hide", "image", "toc", "title"];
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * @fileOverview Provides functionalities for processing Jupyter Notebook files (.ipynb) 
 * 
 * The module serves as the core of the ipynb2web conversion pipeline, handling various stages of content transformation and site structure generation. This includes converting notebooks to HTML, creating audio files from specified content, generating sitemaps for web navigation, and publishing processed files. 
 * 
 * Functions exposed from [node](module-node.html) and [cli](module-cli.html) into different web formats and managing related assets. 
 * @module prerender
 * @exports {Object} - Exports functions like createAudio, createSitemap, and cli_nbs2html for processing Jupyter Notebooks and related assets.
 * @author Charles Karpati
 */





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
 * Appends each ipynb to sitemap.txt by calling [processDirectory](module-prerender.html#.processDirectory).
 *
 * @async
 * @memberof module:prerender
 * @param {string} [SAVETO='./src/posts/'] - The directory to search for JSON map files.
 * @param {string} [sitemapFile='./sitemap.txt'] - The file path where the sitemap will be saved.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; processes and writes to the sitemap file directly.
 * @throws {Error} Logs an error to the console if there is a failure in writing the sitemap file and verbose is true.
 */
function _createAudio() {
  _createAudio = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var from,
      to,
      _yield$import,
      speechFromDir,
      _args = arguments;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          from = _args.length > 0 && _args[0] !== undefined ? _args[0] : './src/posts/';
          to = _args.length > 1 && _args[1] !== undefined ? _args[1] : './src/client/audio/';
          _context.next = 4;
          return Promise.resolve(/* import() | audio */).then(__webpack_require__.bind(__webpack_require__, 233));
        case 4:
          _yield$import = _context.sent;
          speechFromDir = _yield$import.speechFromDir;
          speechFromDir(from, to);
        case 7:
        case "end":
          return _context.stop();
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
 * @param {Array<string>} pages - An array to accumulate page URLs for the sitemap.
 * @param {string} directory - The directory to process.
 * @param {string} [subdir=''] - A subdirectory path to append to each URL in the sitemap.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; modifies the 'pages' array by reference.
 * @throws {Error} Logs an error to the console if unable to process a directory and verbose is true.
 */
function _createSitemap() {
  _createSitemap = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var SAVETO,
      sitemapFile,
      verbose,
      pages,
      _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          SAVETO = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : './src/posts/';
          sitemapFile = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : './sitemap.txt';
          verbose = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : false;
          pages = [];
          verbose && console.log("\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ START createSitemap \n\n");
          _context2.next = 7;
          return processDirectory(pages, SAVETO, '');
        case 7:
          _context2.prev = 7;
          _context2.next = 10;
          return external_fs_.writeFile(sitemapFile, pages.join('\n') + '\n');
        case 10:
          verbose && console.log('Sitemap file created successfully:', sitemapFile);
          _context2.next = 16;
          break;
        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](7);
          verbose && console.error("Error creating or truncating sitemap file: ".concat(sitemapFile), _context2.t0);
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[7, 13]]);
  }));
  return _createSitemap.apply(this, arguments);
}
function processDirectory(_x, _x2) {
  return _processDirectory.apply(this, arguments);
}
/**
 * Calls [generate_sectionmap](module-prerender.html#.generate_sectionmap) for each file in directory.
 *
 * @async
 * @memberof module:prerender
 * @param {string} [FROM='./src/ipynb/'] - The directory containing .ipynb files to process.
 * @param {string} directory - A subdirectory to process within the FROM path.
 * @param {string} [SAVETO='./src/posts/'] - The directory where the processed files will be saved.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; the function is used for processing files in place.
 * @throws {Error} Logs an error to the console if unable to process the specified directory and verbose is true.
 */
function _processDirectory() {
  _processDirectory = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(pages, directory) {
    var subdir,
      verbose,
      stat,
      files,
      _args4 = arguments;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          subdir = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : '';
          verbose = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : false;
          console.log('processDirectory', {
            directory: directory,
            subdir: subdir
          });
          _context4.next = 5;
          return external_fs_.promises.stat(directory);
        case 5:
          stat = _context4.sent;
          if (stat.isDirectory()) {
            _context4.next = 9;
            break;
          }
          verbose && console.log('\n\n UNABLE TO PROCESS DIRECTORY: ', directory, subdir);
          return _context4.abrupt("return");
        case 9:
          _context4.next = 11;
          return external_fs_.promises.readdir(directory);
        case 11:
          files = _context4.sent;
          _context4.next = 14;
          return Promise.all(files.filter(function (file) {
            return file.includes('_map.json');
          }).map( /*#__PURE__*/function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(file) {
              var filePath, jsonData;
              return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    filePath = external_path_.join(directory, file);
                    _context3.t0 = JSON;
                    _context3.next = 4;
                    return external_fs_.promises.readFile(filePath, 'utf-8');
                  case 4:
                    _context3.t1 = _context3.sent;
                    jsonData = _context3.t0.parse.call(_context3.t0, _context3.t1);
                    jsonData.forEach(function (obj) {
                      if (obj.filename) {
                        pages.push("/".concat(file.split('_')[0].split('.')[0], "/").concat(subdir ? subdir + '/' : '').concat(obj.filename));
                      }
                    });
                  case 7:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            }));
            return function (_x12) {
              return _ref.apply(this, arguments);
            };
          }()));
        case 14:
          _context4.next = 16;
          return Promise.all(files.filter(function (file) {
            return !external_path_.extname(file);
          }).map(function (file) {
            return processDirectory(pages, external_path_.join(directory, file), external_path_.join(subdir, file));
          }));
        case 16:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _processDirectory.apply(this, arguments);
}
function cli_nbs2html(_x3, _x4, _x5) {
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
 * @returns {void} Does not return a value; processes files and creates a section map.
 * @throws {Error} Logs an error to the console if there are issues creating the directory or writing the section map file and verbose is true.
 */
function _cli_nbs2html() {
  _cli_nbs2html = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(FROM, directory, SAVETO) {
    var verbose,
      stat,
      pages,
      _args5 = arguments;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          verbose = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : false;
          FROM || (FROM = './src/ipynb/');
          SAVETO || (SAVETO = './src/posts/');
          // Search the pathto directory for .ipynb files
          verbose && console.log("\n~ ~ ~ cli_nbs2html: ".concat(FROM).concat(directory, "\n"));
          // const stat = await fs.promises.stat(`${FROM}${directory}/`);
          _context5.next = 6;
          return external_fs_.promises.stat("".concat(FROM).concat(directory, "/"));
        case 6:
          stat = _context5.sent;
          if (stat.isDirectory()) {
            _context5.next = 10;
            break;
          }
          verbose && console.log('\n\n UNABLE TO PROCESS DIRECTORY: ', directory, subdir);
          return _context5.abrupt("return");
        case 10:
          _context5.next = 12;
          return external_fs_.promises.readdir("".concat(FROM).concat(directory, "/"));
        case 12:
          pages = _context5.sent.filter(function (file) {
            return external_path_.extname(file) === ".ipynb";
          }).map(function (file) {
            return external_path_.parse(file).name;
          });
          // filename without extension
          generate_sectionmap(pages, FROM, directory, SAVETO);
        case 14:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _cli_nbs2html.apply(this, arguments);
}
function generate_sectionmap(_x6, _x7, _x8, _x9) {
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
 * @returns {Object} The final processed data of the notebook.
 * @throws {Error} Logs an error to the console if there is a failure in writing the output file.
 */
function _generate_sectionmap() {
  _generate_sectionmap = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(pages, FROM, directory, SAVETO) {
    var verbose,
      server,
      links,
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
      _iterator,
      _step,
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
      _args6 = arguments;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          verbose = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : false;
          verbose && console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ cli_nbs2html: generate_sectionmap: ", pages, directory, verbose = false);
          server = external_http_server_namespaceObject.createServer({
            root: "./",
            cors: true,
            host: "0.0.0.0"
          });
          server.listen(8085, function () {});
          links = []; // Create saveto directory if it doesn't exist
          _context6.prev = 5;
          _context6.next = 8;
          return external_fs_.promises.access("".concat(SAVETO).concat(directory));
        case 8:
          _context6.next = 24;
          break;
        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](5);
          if (!(_context6.t0.code === "ENOENT")) {
            _context6.next = 23;
            break;
          }
          _context6.prev = 13;
          _context6.next = 16;
          return external_fs_.promises.mkdir("".concat(SAVETO).concat(directory), {
            recursive: true
          });
        case 16:
          _context6.next = 21;
          break;
        case 18:
          _context6.prev = 18;
          _context6.t1 = _context6["catch"](13);
          console.error("Error creating directory:", _context6.t1);
        case 21:
          _context6.next = 24;
          break;
        case 23:
          console.error("Error accessing directory:", _context6.t0);
        case 24:
          if (!directory) {
            _context6.next = 40;
            break;
          }
          _context6.next = 27;
          return ipynb_publish("".concat(FROM).concat(directory), SAVETO);
        case 27:
          _yield$ipynb_publish$ = _context6.sent.meta;
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
        case 40:
          _iterator = _createForOfIteratorHelper(pages);
          _context6.prev = 41;
          _iterator.s();
        case 43:
          if ((_step = _iterator.n()).done) {
            _context6.next = 54;
            break;
          }
          page = _step.value;
          _context6.t2 = !page.startsWith("_");
          if (!_context6.t2) {
            _context6.next = 50;
            break;
          }
          _context6.next = 49;
          return ipynb_publish("".concat(FROM).concat(directory, "/").concat(page), "".concat(SAVETO).concat(directory));
        case 49:
          _context6.t2 = _context6.sent;
        case 50:
          _r = _context6.t2;
          if (_r && !!!_r.meta.hide) {
            _r$meta = _r.meta, _csp = _r$meta.csp, _sitemap = _r$meta.sitemap, _breadcrumbs = _r$meta.breadcrumbs, _badges = _r$meta.badges, _keywords = _r$meta.keywords, _comments = _r$meta.comments, _hide = _r$meta.hide, _image = _r$meta.image, _toc = _r$meta.toc, _title = _r$meta.title, _rest = _objectWithoutProperties(_r$meta, _excluded2);
            links.push(_rest);
          }
        case 52:
          _context6.next = 43;
          break;
        case 54:
          _context6.next = 59;
          break;
        case 56:
          _context6.prev = 56;
          _context6.t3 = _context6["catch"](41);
          _iterator.e(_context6.t3);
        case 59:
          _context6.prev = 59;
          _iterator.f();
          return _context6.finish(59);
        case 62:
          sitemapPath = "".concat(SAVETO).concat(directory || 'index', "_map.json");
          _context6.prev = 63;
          _context6.next = 66;
          return external_fs_.promises.writeFile(sitemapPath, JSON.stringify(links));
        case 66:
          _context6.next = 73;
          break;
        case 68:
          _context6.prev = 68;
          _context6.t4 = _context6["catch"](63);
          _context6.next = 72;
          return external_fs_.promises.writeFile(sitemapPath, "{}");
        case 72:
          verbose && console.log("----ERROR:", r.meta);
        case 73:
          server.close(function () {
            verbose && console.log("Server closed.");
          });
        case 74:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[5, 10], [13, 18], [41, 56, 59, 62], [63, 68]]);
  }));
  return _generate_sectionmap.apply(this, arguments);
}
function ipynb_publish(_x10, _x11) {
  return _ipynb_publish.apply(this, arguments);
}
function _ipynb_publish() {
  _ipynb_publish = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(fullFilePath, saveDir) {
    var type,
      _final,
      _yield$import2,
      nb2json,
      pyCode,
      file,
      pyCodeFilePath,
      txt,
      t,
      _args7 = arguments;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          type = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : "json";
          if (!(type === "json")) {
            _context7.next = 9;
            break;
          }
          _context7.next = 4;
          return Promise.resolve(/* import() | convert */).then(__webpack_require__.bind(__webpack_require__, 216));
        case 4:
          _yield$import2 = _context7.sent;
          nb2json = _yield$import2.nb2json;
          _context7.next = 8;
          return nb2json(fullFilePath);
        case 8:
          _final = _context7.sent;
        case 9:
          pyCode = _final.meta.pyCode;
          if (!(pyCode !== null && pyCode !== void 0 && pyCode.length)) {
            _context7.next = 18;
            break;
          }
          file = external_path_.basename(fullFilePath, '.ipynb'); // Extracts filename without extension
          file = file.replace(/^\d{2}_/, ''); // Remove XX_ prefix
          file = _final.meta.default_exp || file; // Use default export name if available

          // Construct the path for Python code file
          pyCodeFilePath = external_path_.join(saveDir, "".concat(file, ".py"));
          txt = pyCode.join('\n').replace(/(^|\n) /g, '$1');
          _context7.next = 18;
          return external_fs_.promises.writeFile(pyCodeFilePath, txt);
        case 18:
          delete _final.meta.pyCode;

          // Save the final file in the specified format
          t = external_path_.join(saveDir, "".concat(_final.meta.filename, ".").concat(type));
          _context7.prev = 20;
          _context7.next = 23;
          return external_fs_.promises.writeFile(t, type === "json" ? JSON.stringify(_final) : _final);
        case 23:
          _context7.next = 28;
          break;
        case 25:
          _context7.prev = 25;
          _context7.t0 = _context7["catch"](20);
          console.log("ERROR writing file:", t);
        case 28:
          return _context7.abrupt("return", _final);
        case 29:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[20, 25]]);
  }));
  return _ipynb_publish.apply(this, arguments);
}

;// CONCATENATED MODULE: ./src/cli.js
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
  console.log("Usage: ipynb2web <COMMAND> <SAVETO> <FROM/or/SitemapName>\n    \nCommands:\n  sitemap      Create a sitemap.\n  audio        Create audio assets.\n  help         Display this help message.\n");
}

/**
 * Command line interface function that processes given arguments and calls the appropriate function based on the first argument.
 *
 * @param {string[]} args - An array of command line arguments.
 * - args[0]: 'Command' - Enter ['sitemap', 'audio'] to create these assets. If neither, it will the value be appended to the SAVETO and FROM paths for processing nb2json on.
 * - args[1]: 'SAVETO' - This directory path, used as a target directory for saving files.
 * - args[2]: 'FROM' - This directory path, used as an output directory for processing files (Whenever args[0] is NOT 'sitemap').
 * - args[2]: 'sitemapFile' - The file path for saving the sitemap (ONLY when args[0] is 'sitemap').
 * @memberof module:Ipynb2web:cli
 */
function cli(args) {
  var directory = args[0] || '';
  var SAVETO = args[1] || false;
  var FROM = args[2] || false;
  var sitemapFile = args[2] || false;

  // console.log('CLI RECEIVED args: ', args);

  /**
   * Based on the first argument, call the appropriate function.
   * If 'sitemap', call createSitemap.
   * If 'audio', call createAudio.
   * Otherwise, call cli_nbs2html.
   */
  if (directory === 'sitemap') {
    createSitemap(SAVETO || './src/posts/', sitemapFile || './sitemap.txt');
  } else if (directory === 'audio') {
    createAudio(FROM, SAVETO);
  } else {
    cli_nbs2html(FROM, directory, SAVETO);
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
  if (args[0] === 'help') {
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