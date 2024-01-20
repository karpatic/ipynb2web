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


import { marked } from "marked";
import { makeDetails, replaceEmojis, convertNotes, replaceAndLog } from './convert_util.mjs'

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
 * @memberof module:convert
 */
async function nb2json(ipynbPath, verbose = false) {
  pyCode = []
  prettify = false;
  let url = ipynbPath;
  if (typeof process !== "undefined" && !ipynbPath.startsWith("http")) {
    url = `http://localhost:8085/${ipynbPath}.ipynb`;
  }

  let ipynb = await fetch(url, { headers: { "Content-Type": "application/json; charset=utf-8" } });
  const nb = await ipynb.json();

  const meta = get_metadata(nb.cells[0]);
  meta.filename = ipynbPath.split("/")[ipynbPath.split("/").length - 1].toLowerCase().replaceAll(" ", "_");

  verbose && console.log('- get_metadata', meta, '\n');

  // Convert file 
  let content = convertNb(nb.cells.slice(1), meta).flat().join(" ");
  verbose && pyCode.length && console.log({ pyCode });

  meta.pyCode = pyCode;
  (meta.prettify || prettify) &&
    (content += `
  <script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"></script>
  <link rel="stylesheet" href="https://cdn.rawgit.com/google/code-prettify/master/styles/desert.css"/>
  `);

  verbose && console.log('- - content Ran ~~~~~~~~~~~', content, '~~~~~~~~~~~\n');
  let resp = replaceEmojis(content);
  verbose && console.log('- - replaceEmojis Ran', '\n');
  return { meta, content: resp };
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
function get_metadata(data) {
  const returnThis = {};
  for (const line of data.source) {
    if (line.startsWith("#")) {
      returnThis.title = line.replaceAll("\n", "").replaceAll("# ", "", 2);
    } else if (line.startsWith(">")) {
      returnThis.summary = line.replaceAll("\n", "").replaceAll("> ", "", 1);
    } else if (line.startsWith("-")) {
      const key = line.slice(line.indexOf("- ") + 2, line.indexOf(": "));
      const val = line
        .slice(line.indexOf(": ") + 2)
        .replaceAll("\n", "")
        .trim();
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
function convertNb(cells, meta, verbose = false) {
  verbose && console.log('- convertNb Running');
  return cells.map((c) => cleanCell(c, meta));
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
function cleanCell(cell, meta, verbose = false) {
  verbose && console.log('- - cleanCell Running');//, cell ,'\n'); 
  let x;
  if (cell["cell_type"] == "markdown") {
    verbose && console.log('- - - Parsing Markdown');
    x = processMarkdown(cell["source"].join(" "))
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
    if (key == 'note') { return match }
    return `<aside class="${key}">${value}</aside>`;
  });
  x = marked.parse(x)

  // wrap li's in a div or p
  x = x.replace(/<li>(.*?)<\/li>/g, (match, innerContent) => {
    const containsBlockLevel = /<(p|div|blockquote|pre|hr|form)/.test(innerContent);
    let returnThis = `<li>${containsBlockLevel ? `<div>${innerContent}</div>` : `<p>${innerContent}</p>`}</li>`
    return returnThis;
  });

  // replace code blocks with pre.prettyprint
  x = replaceAndLog(x, /<pre><code>([\s\S]*?)<\/code><\/pre>/g, () => { prettify = true; "<pre class='prettyprint'>$1</pre>" });
  x = replaceAndLog(x, /<code>([\s\S]*?)<\/code>/g, () => { prettify = true; "<pre class='prettyprint'>$1</pre>" });

  // local redirects pingServer
  x = replaceAndLog(x, /<a\s+(?:[^>]*?\s+)?href="(.*?)"/g, (match, href) => {
    // open links in new tab
    if (!href.startsWith("./")) {
      match += ' onclick="window.pingServer(this)" target="_blank" rel="noopener noreferrer nofollow"';
    }
    return match;
  });

  x = convertNotes(x);

  return x
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
function processCode(cell, meta, verbose = false) {
  verbose && console.log('- - - processCode Running');
  let x = [];
  let flags = [];
  // source
  if (cell["source"].length) {
    verbose && console.log('- - - - Raw Input Source', cell['source'])
    let source = cell["source"];
    flags = getFlags(source[0]);
    verbose && console.log('- - - - - Flags: ', flags);
    if (flags.length > 0) { source = source.slice(1) }
    source = processSource(source.join(" "), flags, meta);
    x.push(source);
  }
  // output
  if (cell["outputs"].length) {
    verbose && console.log('- - - - Raw Process Outputs', cell['outputs'])
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
 * @memberof module:convert
 * @param {string} source - The source code of a notebook cell.
 * @returns {string[]} An array of detected flags in the cell's source code.
 */
function getFlags(source) {
  const input_aug = [
    "#collapse_input_open",
    "#collapse_input",
    "#collapse_output_open",
    "#collapse_output",
    "#hide_input",
    "#hide_output",
    "#hide",
    "%%capture",
    "%%javascript",
    "%%html",
    "#export"
  ];
  const sourceFlags = source.split(/\s+/); // Split by whitespace
  return input_aug.filter((x) => sourceFlags.includes(x));
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
function processSource(source, flags, meta, verbose = false) {
  if ('#export' == flags[flags.length - 1]) { pyCode.push(source); }
  for (let lbl of flags) {
    let skipList = ["#hide", "#hide_input", "%%javascript", "%%html", "%%capture"]
    if (skipList.includes(lbl)) { return ""; }
  }
  if (meta.prettify) { source = `<pre class='prettyprint'>${source}</pre>`; }
  let flagg = flags && !!flags.includes('#collapse_input_open')
  if (flagg) {
    verbose && console.log(flags)
    for (let lbl of flags) {
      source = source.replaceAll(lbl + "\r\n", "");
      source = source.replaceAll(lbl + "\n", ""); // Strip the Flag  
      if (lbl == "#collapse_input_open") source = makeDetails(source, true);
      else if (lbl == "#collapse_input") source = makeDetails(source, false);
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
function processOutput(source, flags, verbose = false) {
  if (source["output_type"] == "error") {
    return "";
  }
  if (source["output_type"] == "stream") {
    if (source["name"] == "stderr") {
      return "";
    }
    source["data"] = { "text/html": source["text"] };
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

export { nb2json, get_metadata, convertNb } 