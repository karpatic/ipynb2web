/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 231:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 423:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 608:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  nb2json: () => (/* binding */ nb2json)
});

// UNUSED EXPORTS: convertNb, get_metadata

;// CONCATENATED MODULE: external "marked"
const external_marked_namespaceObject = require("marked");
;// CONCATENATED MODULE: ./src/convert_util.mjs
/**
 * Creates an HTML details element with the given content. Called by processOutput and processSource.
 * 
 * @param {string} content - The HTML content to be placed inside the details tag.
 * @param {boolean} open - Determines if the details should be open by default.
 * @returns {string} An HTML string representing a details element.
 */
function makeDetails(content, open) {
  return "<details " + (open ? "open" : "") + "> <summary>Click to toggle</summary> " + content + "</details>";
}

/**
 * Replaces specified emoji characters in the text with their corresponding HTML entities. Convert emojis to html entities
 *
 * @param {string} text - The text containing emojis to be replaced.
 * @returns {string} The text with emojis replaced by HTML entities.
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
 */
function convertNotes(str) {
  let matchCount = 0;
  const regex = /(<p)(.*?)\(\(\((.*?)::(.*?)\)\)\)(.*?)(<\/p>)/g;
  const replacement = (_, p1, p2, key, value, p4, p5) => {
    matchCount++;
    let pStart = ""; // style='display:inline' ";
    let lbl = `<label ${pStart} tabindex="0" for='note${matchCount}' class='notelbl'>[${matchCount}]</label>`;
    let fin = `<div>
      <input type='checkbox' id='note${matchCount}' class='notebox'>
      ${p1}${pStart}${p2}${lbl}${p4}${p5}
      <aside>${lbl} ${value} </aside> 
    </div>`;
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
 */
function replaceAndLog(text, input, output) {
  return text.replace(input, function (match, capture) {
    return output.replace?.('$1', capture) || output(match, capture);
  });
}
;
 // ES6 exports
;// CONCATENATED MODULE: ./src/convert.mjs
// Uses ECMAScript modules for Browser and Node.js



/*
Where processing happens
-1 - calling nb2json - yaml filename returned gets formatted
0 - nb2json - meta.filename is fixed up right before returning too
0 - nb2json - meta.prettify inserts script
0 - nb2json - replaceEmojies
0 - nb2json - convertNotes
1 - get_metadata - yaml is parsed, title, summary, keyValues set
*/

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// fname = ./src/ipynb/route/filename (wihout the .ipynb extension, when server calling it)
// fname = /route/filename when from client
// meta.filename = fname UNDERCASED WITH SPACES REPLACED WITH UNDERSCORES.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let prettify = false;
let pyCode = [];

/**
 * Converts a Jupyter Notebook (.ipynb) file to a JSON object containing metadata and content.
 * Must be in directory of ipynb you want to convert to html.
 * 
 * @async
 * @param {string} ipynbPath - The path to the Jupyter Notebook file.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {Object} An object with metadata and processed content of the notebook.
 */
async function nb2json(ipynbPath) {
  let verbose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  pyCode = [];
  prettify = false;
  let url = ipynbPath;
  if (typeof process !== "undefined" && !ipynbPath.startsWith("http")) {
    url = `http://localhost:8085/${ipynbPath}.ipynb`;
  }
  let ipynb = await fetch(url, {
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
  const nb = await ipynb.json();
  const meta = get_metadata(nb.cells[0]);
  meta.filename = ipynbPath.split("/")[ipynbPath.split("/").length - 1].toLowerCase().replaceAll(" ", "_");
  verbose && console.log('- get_metadata', meta, '\n');

  // Convert file 
  let content = convertNb(nb.cells.slice(1), meta).flat().join(" ");
  verbose && pyCode.length && console.log({
    pyCode
  });
  meta.pyCode = pyCode;
  (meta.prettify || prettify) && (content += `
  <script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"></script>
  <link rel="stylesheet" href="https://cdn.rawgit.com/google/code-prettify/master/styles/desert.css"/>
  `);
  verbose && console.log('- - content Ran ~~~~~~~~~~~', content, '~~~~~~~~~~~\n');
  let resp = replaceEmojis(content);
  verbose && console.log('- - replaceEmojis Ran', '\n');
  return {
    meta,
    content: resp
  };
}

/**
 * Extracts metadata from the first cell of a Jupyter Notebook, interpreting it as YAML.
 * Get markdown and check EACH LINE for yaml. Special characters must have a space after them.
 * ("# Title", "> summary", "- key1: value1")")
 * returns: { title: "Title", summary: "summary", key1: "value1" }
 *
 * @param {Object[]} data - An array of cells from a Jupyter Notebook.
 * @returns {Object} An object containing extracted metadata like title, summary, and key-values.
 */
function get_metadata(data) {
  const returnThis = {};
  for (const line of data.source) {
    if (line.startsWith("#")) {
      returnThis.title = line.replaceAll("\n", "").replaceAll("# ", "", 2);
    } else if (line.startsWith(">")) {
      returnThis.summary = line.replaceAll("\n", "").replaceAll("> ", "", 1);
    } else if (line.startsWith("-")) {
      const key = line.slice(line.indexOf("- ") + 2, line.indexOf(": "));
      const val = line.slice(line.indexOf(": ") + 2).replaceAll("\n", "").trim();
      returnThis[key] = val;
    }
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
  let verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  verbose && console.log('- convertNb Running');
  return cells.map(c => cleanCell(c, meta));
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
  let verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  verbose && console.log('- - cleanCell Running'); //, cell ,'\n'); 
  let x;
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
    return `<aside class="${key}">${value}</aside>`;
  });
  x = external_marked_namespaceObject.marked.parse(x);

  // wrap li's in a div or p
  x = x.replace(/<li>(.*?)<\/li>/g, (match, innerContent) => {
    const containsBlockLevel = /<(p|div|blockquote|pre|hr|form)/.test(innerContent);
    let returnThis = `<li>${containsBlockLevel ? `<div>${innerContent}</div>` : `<p>${innerContent}</p>`}</li>`;
    return returnThis;
  });

  // replace code blocks with pre.prettyprint
  x = replaceAndLog(x, /<pre><code>([\s\S]*?)<\/code><\/pre>/g, () => {
    prettify = true;
    "<pre class='prettyprint'>$1</pre>";
  });
  x = replaceAndLog(x, /<code>([\s\S]*?)<\/code>/g, () => {
    prettify = true;
    "<pre class='prettyprint'>$1</pre>";
  });

  // local redirects pingServer
  x = replaceAndLog(x, /<a\s+(?:[^>]*?\s+)?href="(.*?)"/g, (match, href) => {
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
 * Calls getFlags, processSource, processOutput
 *
 * @param {Object} cell - A code cell from a Jupyter Notebook.
 * @param {Object} meta - Metadata associated with the notebook.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {string[]} An array of strings representing the processed content of the code cell.
 */
function processCode(cell, meta) {
  let verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  verbose && console.log('- - - processCode Running');
  let x = [];
  let flags = [];
  // source
  if (cell["source"].length) {
    verbose && console.log('- - - - Raw Input Source', cell['source']);
    let source = cell["source"];
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
    for (let o of cell["outputs"]) {
      x.push(processOutput(o, flags));
    }
    verbose && console.log('- - - - - processOutput: ', x);
    // clear_output();
  }
  verbose && console.log('- - - processCode Ran');
  return x;
}

/**
 * Detects special flags in the source code of a notebook cell.
 * Detect and stripout and handle flags.
 *
 * @param {string} source - The source code of a notebook cell.
 * @returns {string[]} An array of detected flags in the cell's source code.
 */
function getFlags(source) {
  const input_aug = ["#collapse_input_open", "#collapse_input", "#collapse_output_open", "#collapse_output", "#hide_input", "#hide_output", "#hide", "%%capture", "%%javascript", "%%html", "#export"];
  const sourceFlags = source.split(/\s+/); // Split by whitespace
  return input_aug.filter(x => sourceFlags.includes(x));
}

/**
 * Processes the source of a code cell, applying transformations based on flags and metadata.
 * Strip Flags from text, make details, hide all. Append to pyCode
 *
 * @param {string} source - The source code of a notebook cell.
 * @param {string[]} flags - An array of flags affecting the processing.
 * @param {Object} meta - Metadata associated with the notebook.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {string} The processed source code.
 */
function processSource(source, flags, meta) {
  let verbose = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if ('#export' == flags[flags.length - 1]) {
    pyCode.push(source);
  }
  for (let lbl of flags) {
    let skipList = ["#hide", "#hide_input", "%%javascript", "%%html", "%%capture"];
    if (skipList.includes(lbl)) {
      return "";
    }
  }
  if (meta.prettify) {
    source = `<pre class='prettyprint'>${source}</pre>`;
  }
  let flagg = flags && !!flags.includes('#collapse_input_open');
  if (flagg) {
    verbose && console.log(flags);
    for (let lbl of flags) {
      source = source.replaceAll(lbl + "\r\n", "");
      source = source.replaceAll(lbl + "\n", ""); // Strip the Flag  
      if (lbl == "#collapse_input_open") source = makeDetails(source, true);else if (lbl == "#collapse_input") source = makeDetails(source, false);
    }
    return source;
  }
}

/**
 * Processes the output of a code cell, applying transformations based on flags and output type.
 * Strip Flags from output, make details, hide all.
 *
 * @param {Object} source - The output of a code cell.
 * @param {string[]} flags - An array of flags affecting the processing.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {string} The processed output content.
 */
function processOutput(source, flags) {
  let verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
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
  const keys = Object.keys(source["data"]);
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
  for (let lbl of flags) {
    try {
      source = source.replaceAll(lbl + "\r\n", "");
      source = source.replaceAll(lbl + "\n", "");
    } catch {
      verbose && console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!processOutput... ", typeof source, source);
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
  return source;
  //output_type == 'stream' ==> text
  //output_type == 'display_data' ==> data{'application/javascript' or 'text/html' or 'execute_result'}
}

/***/ }),

/***/ 272:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   speechFromDir: () => (/* binding */ speechFromDir)
/* harmony export */ });
/* unused harmony exports createSpeech, saveSpeech, getTextFromJson */
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(231);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(423);



/**
 * Creates an audio speech from text using the OpenAI API.
 * 
 * @async
 * @param {string} input - The text to be converted into speech.
 * @param {string} [apikey] - The OpenAI API key. If not provided, it will use the environment variable 'OPENAI_API_KEY'.
 * @param {string} [voice='echo'] - The voice model to use.
 * @param {number} [speed=1.0] - The speed of the speech (0.25 to 4.0).
 * @param {string} [model='tts-1'] - The speech model to use.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {Buffer|null} The audio data as a Buffer, or null if an error occurs or no API key is provided.
 * @throws {Error} Logs an error to the console if fetching the speech fails and verbose is true.
 */
async function createSpeech(input, apikey) {
  let voice = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'echo';
  let speed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
  let model = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'tts-1';
  let verbose = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  if (!apikey) {
    apikey = process.env.OPENAI_API_KEY;
  }
  if (!apikey) {
    verbose && console.log('No API Key provided and \"env.OPENAI_API_KEY\" not found.');
    return;
  }
  try {
    const openai = new OpenAI(apikey);
    // Speed [ `0.25` - `4.0`]. default = `1.0`. 
    // The maximum length is 4096 characters.
    const mp3Response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apikey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        input,
        voice,
        speed,
        response_format: 'mp3'
      })
    });
    var buffer = await mp3Response.buffer();
  } catch (e) {
    verbose && console.log('createSpeech error', e);
    return;
  }
  return buffer;
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
 */
async function saveSpeech(mp3SaveFilePath, buffer) {
  let verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  try {
    await fs__WEBPACK_IMPORTED_MODULE_0__.promises.writeFile(mp3SaveFilePath, buffer);
    verbose && console.log(`Audio saved to ${mp3SaveFilePath}`);
  } catch (e) {
    verbose && console.log('saveSpeech error', e);
  }
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
 */

async function getTextFromJson(json, apikey) {
  let verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (!apikey) {
    apikey = process.env.OPENAI_API_KEY;
  }
  if (!apikey) {
    verbose && console.log('No API Key provided and \"env.OPENAI_API_KEY\" not found.');
    return;
  }
  try {
    let text = !json.title ? '' : `Title:   ${json.title} \n `;
    text += !json.summary ? '' : `Summary: ${json.summary} \n `;
    text += `Content: ${JSON.stringify(json.content)}`;
    const requestBody = {
      model: "gpt-4-1106-preview",
      messages: [{
        "role": "system",
        "content": `
You are an assistant to a webpage to audio service. 
You will be given a webpage you must convert it to a form of text ready for reading aloud.
Start every conversion with a statement "You are listening to the audio version of this webpage" followed by the title and summary.
Under no circumstances should code be read and should be paraphrased or skipped. 
`
      }, {
        "role": "user",
        "content": text
      }]
    };
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apikey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    let data;
    const responseData = await response.json();
    data = responseData.choices[0].message.content;
  } catch (e) {
    verbose && console.log('getTextFromJson error', e);
    return;
  }
  return data;
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
 */

async function speechFromDir(fromFolder, toFolder, apikey) {
  let verbose = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (!apikey) {
    apikey = process.env.OPENAI_API_KEY;
  }
  if (!apikey) {
    verbose && console.log('No API Key provided and \"env.OPENAI_API_KEY\" not found.');
    return;
  }
  // get all files in SAVETO.
  try {
    const files = fs__WEBPACK_IMPORTED_MODULE_0__.readdirSync(fromFolder);
    for (let i = 0; i < files.length; i++) {
      const filename = path__WEBPACK_IMPORTED_MODULE_1__.join(fromFolder, files[i]);
      const stat = fs__WEBPACK_IMPORTED_MODULE_0__.lstatSync(filename);
      if (stat.isDirectory()) {
        speechFromDir(filename, toFolder); //recurse
      } else if (filename.indexOf('.json') >= 0) {
        let file = fs__WEBPACK_IMPORTED_MODULE_0__.readFileSync(filename, 'utf8');
        let json = JSON.parse(file);
        if (json?.meta?.audio) {
          let text = await getTextFromJson(json);
          let buffer = await createSpeech(text, apikey);
          let file = files[i].substring(0, files[i].length - 5);
          // console.log('file', file)
          let savePath = path__WEBPACK_IMPORTED_MODULE_1__.join(toFolder, file) + '.mp3';
          // console.log('savePath', savePath)
          saveSpeech(savePath, buffer);
        }
      }
    }
  } catch (e) {
    verbose && console.log('speechFromDir error', e);
    return;
  }
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src_cli)
});

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(231);
// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(423);
;// CONCATENATED MODULE: external "http-server"
const external_http_server_namespaceObject = require("http-server");
;// CONCATENATED MODULE: ./src/prerender.mjs




/** 
 * Checks YAML for `audio` tag and creates the file
 *
 * @async
 * @param {string} [from='./src/client/posts/'] - The source directory containing content to be converted to audio.
 * @param {string} [to='./src/client/audio/'] - The target directory where audio files will be saved.
 */

async function createAudio() {
  let from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './src/client/posts/';
  let to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : './src/client/audio/';
  const {
    speechFromDir
  } = await Promise.resolve(/* import() | audio */).then(__webpack_require__.bind(__webpack_require__, 272));
  speechFromDir(from, to);
}

/**
 * Appends each ipynb to sitemap.txt by calling processDirectory().
 *
 * @async
 * @param {string} [SAVETO='./src/client/posts/'] - The directory to search for JSON map files.
 * @param {string} [sitemapFile='./sitemap.txt'] - The file path where the sitemap will be saved.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; processes and writes to the sitemap file directly.
 * @throws {Error} Logs an error to the console if there is a failure in writing the sitemap file and verbose is true.
 */

async function createSitemap() {
  let SAVETO = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './src/client/posts/';
  let sitemapFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : './sitemap.txt';
  let verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let pages = [];
  verbose && console.log(`\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ START createSitemap \n\n`);
  await processDirectory(pages, SAVETO, '');
  try {
    await external_fs_.writeFile(sitemapFile, pages.join('\n') + '\n');
    verbose && console.log('Sitemap file created successfully:', sitemapFile);
  } catch (err) {
    verbose && console.error(`Error creating or truncating sitemap file: ${sitemapFile}`, err);
  }
}

/**
 * Recursively searches for _map.json files [created from cli_nbs2html()->generate_sectionmap() ] and appends the mappings to sitemap.txt.
 *
 * @async
 * @param {Array<string>} pages - An array to accumulate page URLs for the sitemap.
 * @param {string} directory - The directory to process.
 * @param {string} [subdir=''] - A subdirectory path to append to each URL in the sitemap.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; modifies the 'pages' array by reference.
 * @throws {Error} Logs an error to the console if unable to process a directory and verbose is true.
 */
async function processDirectory(pages, directory) {
  let subdir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  let verbose = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  const stat = await external_fs_.stat(directory);
  if (!stat.isDirectory()) {
    verbose && console.log('\n\n UNABLE TO PROCESS DIRECTORY: ', directory, subdir);
    return;
  }
  const files = await external_fs_.readdir(directory);
  await Promise.all(files.filter(file => file.includes('_map.json')).map(async file => {
    const filePath = external_path_.join(directory, file);
    const jsonData = JSON.parse(await external_fs_.readFile(filePath, 'utf-8'));
    jsonData.forEach(obj => {
      if (obj.filename) {
        pages.push(`http://www.charleskarpati.com/${file.split('_')[0].split('.')[0]}/${subdir ? subdir + '/' : ''}${obj.filename}`);
      }
    });
  }));

  // recursively process subdirectories
  await Promise.all(files.filter(file => !external_path_.extname(file)).map(file => {
    return processDirectory(pages, external_path_.join(directory, file), external_path_.join(subdir, file));
  }));
}

/**
 * Calls generate_sectionmap() for each file in directory.
 *
 * @async
 * @param {string} [FROM='./src/ipynb/'] - The directory containing .ipynb files to process.
 * @param {string} directory - A subdirectory to process within the FROM path.
 * @param {string} [SAVETO='./src/client/posts/'] - The directory where the processed files will be saved.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; the function is used for processing files in place.
 * @throws {Error} Logs an error to the console if unable to process the specified directory and verbose is true.
 */

async function cli_nbs2html() {
  let FROM = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './src/ipynb/';
  let directory = arguments.length > 1 ? arguments[1] : undefined;
  let SAVETO = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : './src/client/posts/';
  let verbose = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  // Search the pathto directory for .ipynb files
  verbose && console.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ cli_nbs2html: start: ${FROM}${directory}/`);
  const stat = await external_fs_.stat(`${FROM}${directory}/`);
  if (!stat.isDirectory()) {
    verbose && console.log('\n\n UNABLE TO PROCESS DIRECTORY: ', directory, subdir);
    return;
  }
  let pages = (await external_fs_.readdir(`${FROM}${directory}/`)).filter(file => external_path_.extname(file) === ".ipynb").map(file => external_path_.parse(file).name); // filename without extension
  generate_sectionmap(pages, FROM, directory, SAVETO);
}

/**
 * Calls ipynb_publish on all files in the directory. 
 * - Also creates section_map.json which is later used in createSitemap()
 * - It excludes specified metadata fields from section_map.json
 * - Skips _filename.ipynb files entirely and won't add meta.hide yaml's to the section_map.json
 *
 * @async
 * @param {Array<string>} pages - An array of page names to process.
 * @param {string} FROM - The base directory containing .ipynb files.
 * @param {string} directory - A subdirectory to process.
 * @param {string} SAVETO - The directory where the section map will be saved.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; processes files and creates a section map.
 * @throws {Error} Logs an error to the console if there are issues creating the directory or writing the section map file and verbose is true.
 */

async function generate_sectionmap(pages, FROM, directory, SAVETO) {
  let verbose = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  verbose && console.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ cli_nbs2html: generate_sectionmap: `, pages, directory, verbose = false);
  const server = external_http_server_namespaceObject.createServer({
    root: "./",
    cors: true,
    host: "0.0.0.0"
  });
  server.listen(8085, () => {});
  let links = [];

  // Create saveto directory if it doesn't exist
  try {
    await external_fs_.access(`${SAVETO}${directory}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      try {
        await external_fs_.mkdir(`${SAVETO}${directory}`, {
          recursive: true
        });
      } catch (mkdirError) {
        console.error("Error creating directory:", mkdirError);
      }
    } else {
      console.error("Error accessing directory:", error);
    }
  }
  if (directory) {
    let {
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
      ...rest
    } = (await ipynb_publish(`${FROM}${directory}`, SAVETO)).meta;
    links.push(rest);
  }
  for (const page of pages) {
    const r = !page.startsWith("_") && (await ipynb_publish(`${FROM}${directory}/${page}`, `${SAVETO}${directory}`));
    if (r && !!!r.meta.hide) {
      const {
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
        ...rest
      } = r.meta;
      links.push(rest);
    }
  }
  const sitemapPath = `${SAVETO}${directory || 'index'}_map.json`;
  try {
    await external_fs_.writeFile(sitemapPath, JSON.stringify(links));
  } catch (e) {
    await external_fs_.writeFile(sitemapPath, "{}");
    verbose && console.log("----ERROR:", r.meta);
  }
  server.close(() => {
    verbose && console.log("Server closed.");
  });
}

/**
 * Processes and publishes a Jupyter Notebook file, converting it to the specified format and saving it to a directory.
 * Optionally, extracts and saves Python code from the notebook.
 *
 * @async
 * @param {string} fullFilePath - The full path to the Jupyter Notebook file, including the filename and extension.
 * @param {string} saveDir - The directory where the processed file and any extracted Python code will be saved.
 * @param {string} [type='json'] - The format for the output file ('json' is the default format).
 * @returns {Object} The final processed data of the notebook.
 * @throws {Error} Logs an error to the console if there is a failure in writing the output file.
 */
async function ipynb_publish(fullFilePath, saveDir) {
  let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "json";
  let final;
  if (type === "json") {
    const {
      nb2json
    } = await Promise.resolve(/* import() | convert */).then(__webpack_require__.bind(__webpack_require__, 608));
    final = await nb2json(fullFilePath);
  }
  let pyCode = final.meta.pyCode;
  if (pyCode?.length) {
    let file = external_path_.basename(fullFilePath, '.ipynb'); // Extracts filename without extension
    file = file.replace(/^\d{2}_/, ''); // Remove XX_ prefix
    file = final.meta.default_exp || file; // Use default export name if available

    // Construct the path for Python code file
    let pyCodeFilePath = external_path_.join(saveDir, `${file}.py`);
    let txt = pyCode.join('\n').replace(/(^|\n) /g, '$1');
    await external_fs_.writeFile(pyCodeFilePath, txt);
  }
  delete final.meta.pyCode;

  // Save the final file in the specified format
  const t = external_path_.join(saveDir, `${final.meta.filename}.${type}`);
  try {
    await external_fs_.writeFile(t, type === "json" ? JSON.stringify(final) : final);
  } catch (e) {
    console.log("ERROR writing file:", t);
  }
  return final;
}
 // ES6 exports
;// CONCATENATED MODULE: ./src/cli.js
//#!/usr/bin/env node


/**
 * Command line interface function that processes given arguments and calls the appropriate function based on the first argument.
 *
 * @param {string[]} args - An array of command line arguments.
 * - args[0]: The command to execute ('sitemap', 'audio', or the directory for 'cli_nbs2html').
 * - args[1]: The 'SAVETO' directory path, used as a target directory for saving files.
 * - args[2]: The 'FROM' directory path, used as a source directory for processing files.
 * - args[3]: The file path for saving the sitemap (used only when args[0] is 'sitemap').
 */
function cli(args) {
  const directory = args[0] || '';
  const SAVETO = args[1] || false;
  const FROM = args[2] || false;
  const sitemapFile = args[2] || false;
  console.log('CLI RECIEVED: ', {
    args,
    directory
  });
  if (directory === 'sitemap') {
    createSitemap(SAVETO, sitemapFile);
  } else if (directory === 'audio') {
    createAudio(FROM, SAVETO);
  } else {
    cli_nbs2html(FROM, directory, SAVETO);
  }
}
if (require.main === module) {
  const args = process.argv.slice(2);
  cli(args);
}
/* harmony default export */ const src_cli = (cli);
})();

module.exports = __webpack_exports__;
/******/ })()
;