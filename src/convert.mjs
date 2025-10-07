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


import { marked } from "marked";
import { makeDetails, replaceEmojis, convertNotes, replaceAndLog } from './convert_util.mjs'

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// fname = ./src/ipynb/route/filename (wihout the .ipynb extension, when server calling it)
// fname = /route/filename when from client
// meta.filename = fname UNDERCASED WITH SPACES REPLACED WITH UNDERSCORES.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let prettify = false;
let pyCode = [];
let assetsToWrite = [];
let imageIndex = 0;

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
async function nb2json(ipynbPath, verbose = false, extractAssets = false) { 
  pyCode = []
  prettify = false;
  assetsToWrite = [];
  imageIndex = 0;
  
  let url = ipynbPath;
  if (typeof process !== "undefined" && !ipynbPath.startsWith("http")) {
    url = `http://localhost:8085/${ipynbPath}.ipynb`;
  } 

  let ipynb = await fetch(url, { headers: { "Content-Type": "application/json; charset=utf-8" } });
  // console.log('url', url);
  // console.log('ipynb', ipynb);
  const nb = await ipynb.json();
  // console.log('nb', nb);

  const meta = get_metadata(nb.cells[0]);
  meta.filename = ipynbPath.split("/")[ipynbPath.split("/").length - 1].toLowerCase().replaceAll(" ", "_");

  verbose && console.log('- get_metadata', meta, '\n');

  // Convert file 
  let content = convertNb(nb.cells.slice(1), meta, verbose, extractAssets, meta.filename).flat().join(" ");
  verbose && pyCode.length && console.log({ pyCode });

  meta.pyCode = pyCode;
  (meta.prettify || prettify) &&
    (content += `
  <script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"></script>
  <link rel="stylesheet" href="https://cdn.rawgit.com/google/code-prettify/master/styles/desert.css"/>
  `);

  // verbose && console.log('- - content Ran ~~~~~~~~~~~', content, '~~~~~~~~~~~\n');
  let resp = replaceEmojis(content);
  verbose && console.log('- - replaceEmojis Ran', '\n');
  return { meta, content: resp, assets: assetsToWrite };
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
 * @param {string[]|boolean} [extractAssets=false] - Array of asset types to extract (e.g., ['png', 'js', 'txt', 'html']) or boolean for backward compatibility.
 * @param {string} [notebookName=null] - The name of the notebook for asset naming.
 * @returns {string[]} An array of strings representing the processed content of each cell.
 */
function convertNb(cells, meta, verbose = false, extractAssets = false, notebookName = null) {
  verbose && console.group('- convertNb Running');
  let returnThis = cells.map((c) => cleanCell(c, meta, verbose, extractAssets, notebookName));
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
function cleanCell(cell, meta, verbose = false, extractAssets = false, notebookName = null) { 
  let x;
  if (cell["cell_type"] == "markdown") { 
    x = processMarkdown(cell["source"].join(" "))
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
  let x = marked(txt); 
  
  // Two spaces at lines end transform into line breaks 
  x = x.replace(/\s{2,}<\/p>/g, "</p><br>");

  // Remove newline chars even though they dont get rendered. 
  // x = x.replace(/\n/g, '');

  // replace code blocks with pre.prettyprint
  x = replaceAndLog(x, /<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, content) => { prettify = true; return `<pre class='prettyprint'>${content}</pre>`; });
  
  // Single line code blocks do NOT get prettified
  // x = replaceAndLog(x, /<code>([\s\S]*?)<\/code>/g, (match, content) => { prettify = true; return `<pre class='prettyprint' style='display:inline'>${content}</pre>`; });

  // Open links in new tab
  x = replaceAndLog(x, /<a\s+(?:[^>]*?\s+)?href="(.*?)"/g, (match, href) => {
    if (!href.startsWith("./")) {
      match += ' target="_blank" rel="nosopener noreferrer nofollow"';
    }
    return match; 
  });


  // x = createSpans(createInlineFootnotes(createElement(str))
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
 * @param {string[]|boolean} [extractAssets=false] - Array of asset types to extract (e.g., ['png', 'js', 'txt', 'html']) or boolean for backward compatibility.
 * @param {string} [notebookName=null] - The name of the notebook for asset naming.
 * @returns {string[]} An array of strings representing the processed content of the code cell.
 */
function processCode(cell, meta, verbose = false, extractAssets = false, notebookName = null) {
  // verbose && console.log('- - - processCode Running');
  let x = [];
  let flags = [];
  // source
  // verbose && console.group('ProcessCode');
  if (cell["source"].length) { 
    let source = cell["source"];
    flags = getFlags(source[0]);
    // verbose && console.log('Input: ', {'Raw': cell['source'], 'Flags': flags } ) 
    if (flags.length > 0) { source = source.slice(1) }
    source = processSource(source.join(" "), flags, meta);
    x.push(source);
  }
  // output
  if (cell["outputs"].length) { 
    // verbose && console.log(flags, cell['outputs']) 
    for (let o of cell["outputs"]) {
      x.push(processOutput(o, flags, verbose, extractAssets, notebookName));
    } 
    // clear_output();
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
 * @param {string[]|boolean} [extractAssets=false] - Array of asset types to extract (e.g., ['png', 'js', 'txt', 'html']) or boolean for backward compatibility.
 * @param {string} [notebookName=null] - The name of the notebook for asset naming.
 * @returns {string} The processed output content.
 */
function processOutput(source, flags, verbose = false, extractAssets = false, notebookName = null) {
  // console.log('processOutput', source);
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
  
  // Debug logging to see what's happening
  if (verbose || extractAssets) {
    console.log('processOutput debug:', {
      keys,
      data: source["data"],
      hasTextHtml: keys.includes("text/html"),
      hasTextPlain: keys.includes("text/plain"),
      hasAppJs: keys.includes("application/javascript"),
      imageKeys: keys.filter(k => k.startsWith('image/'))
    });
  }
  
  const shouldExtract = (type) => {
    const result = extractAssets === true || (Array.isArray(extractAssets) && extractAssets.some(t => 
      t.toLowerCase() === type || t.toLowerCase() === type.split('/')[1] || 
      (type === 'application/javascript' && t.toLowerCase() === 'js') ||
      (type === 'text/html' && t.toLowerCase() === 'html')));
    
    // Debug logging for shouldExtract
    if ((verbose || extractAssets) && (type === 'text/html' || type === 'application/javascript')) {
      console.log('shouldExtract debug:', {
        type,
        extractAssets,
        result,
        isArray: Array.isArray(extractAssets)
      });
    }
    
    return result;
  };
  
  if (keys.includes("text/html")) {
    const data = source["data"]["text/html"];
    source = Array.isArray(data) ? data.join("") : data;
    
    // Calculate size in bytes
    const sizeInBytes = new TextEncoder().encode(source).length;
    const sizeThreshold = 100 * 1024; // 100KB
    
    // Only extract if starts with doctype, <html>, or is larger than 100KB
    const startsWithDoctype = source.toLowerCase().includes('<!doctype');
    const startsWithHtml = source.toLowerCase().trim().startsWith('<html');
    const isLargeEnough = sizeInBytes > sizeThreshold;
    
    if (shouldExtract('text/html') && typeof process !== "undefined" && (startsWithDoctype || startsWithHtml || isLargeEnough)) {
      const hash = source.substring(0, 8).replace(/[^a-zA-Z0-9]/g, '');
      const name = `${notebookName ? `${notebookName}-` : ''}content-${hash}.html`;
      
      // Debug: Log what's being extracted as HTML
      if (verbose || extractAssets) {
        console.log('Extracting HTML asset:', { name, dataLength: source.length, sizeInBytes, startsWithDoctype, startsWithHtml, isLargeEnough, hash });
      }
      
      assetsToWrite.push({ 
        placeholderName: name, 
        data: source, 
        encoding: 'utf8', 
        type: 'text/html',
        notebookPrefix: notebookName ? `${notebookName}-` : ''
      });
      source = `<iframe src="ASSET_PLACEHOLDER_${name}" width="100%" height="400px"></iframe>`;
    }
  } else if (keys.includes("application/javascript")) {
    const data = source["data"]["application/javascript"];
    
    // Calculate size in bytes for JS content
    const jsContent = Array.isArray(data) ? data.join("") : data;
    const sizeInBytes = new TextEncoder().encode(jsContent).length;
    const sizeThreshold = 100 * 1024; // 100KB
    const isLargeEnough = sizeInBytes > sizeThreshold;
    
    if (shouldExtract('application/javascript') && typeof process !== "undefined" && isLargeEnough) {
      const hash = jsContent.toString().substring(0, 8).replace(/[^a-zA-Z0-9]/g, '');
      const name = `${notebookName ? `${notebookName}-` : ''}script-${hash}.js`;
      
      // Debug: Log what's being extracted as JS
      if (verbose || extractAssets) {
        console.log('Extracting JS asset:', { name, sizeInBytes, isLargeEnough });
      }
      
      assetsToWrite.push({ placeholderName: name, data: jsContent, encoding: 'utf8', type: 'application/javascript' });
      source = `<script src="ASSET_PLACEHOLDER_${name}"></script>`;
    } else {
      source = "<script>" + jsContent + "</script>";
    }
  } else {
    // Check for images first, then fall back to text/plain if no image found
    const imageKey = keys.filter(key => key.startsWith('image/'))[0];
    if (imageKey && source["data"][imageKey]) {
      const data = source["data"][imageKey];
      
      // Debug logging for image processing
      if (verbose || extractAssets) {
        console.log('Image processing debug:', {
          imageKey,
          dataType: typeof data,
          dataLength: data?.length,
          shouldExtractResult: shouldExtract(imageKey),
          processEnv: typeof process !== "undefined"
        });
      }
      
      // Additional check to make sure this is actually image data
      if (typeof data === 'string' && data.length > 50) { // Basic sanity check for image data
        const imageType = imageKey.split('/')[1]; // Extract format (png, jpeg, gif, svg+xml, etc.)
        
        if (shouldExtract(imageKey) && typeof process !== "undefined") {
          // Use simple index-based naming instead of complex unique ID
          imageIndex++;
          
          // Handle special cases for file extensions
          let extension = imageType;
          if (imageType === 'jpeg') extension = 'jpg';
          if (imageType === 'svg+xml') extension = 'svg';
          
          const name = `${notebookName ? `${notebookName}-` : ''}image-${imageIndex}.${extension}`;
          const encoding = imageType === 'svg+xml' ? 'utf8' : 'base64';
          
          // Debug: Log what's being extracted as image
          if (verbose || extractAssets) {
            console.log('Extracting image asset:', { 
              name, 
              imageType, 
              extension, 
              encoding, 
              dataLength: data.length, 
              imageIndex
            }); 
          }
          
          assetsToWrite.push({ 
            placeholderName: name, 
            data: data, 
            encoding: encoding, 
            type: imageKey,
            notebookPrefix: notebookName ? `${notebookName}-` : ''
          });
          source = `<img src="ASSET_PLACEHOLDER_${name}" alt="Image Alt Text">`;
        } else {
          if (verbose || extractAssets) {
            console.log('Image not extracted - inline instead:', { 
              shouldExtract: shouldExtract(imageKey), 
              processUndefined: typeof process === "undefined" 
            });
          }
          source = `<img src="data:${imageKey};base64,${data}" alt="Image Alt Text">`;
        }
      } else {
        // If we reach here, there was an image key but no valid image data
        if (verbose || extractAssets) {
          console.log('Found image key but invalid data:', { imageKey, dataType: typeof data, dataLength: data?.length });
        }
        source = "";
      }
    } else if (keys.includes("text/plain")) {
      const data = source["data"]["text/plain"];
      // Always keep text/plain inline, don't extract to separate files
      source = !/<Figure/.test(data) ? (Array.isArray(data) ? data.join('') : data) : "";
    } else {
      // No recognized content type found
      if (verbose || extractAssets) {
        console.log('No recognized content type found:', { keys, availableData: Object.keys(source["data"]) });
      }
      source = "";
    }
  }

  for (let lbl of flags) {
    try {
      source = source.replaceAll(lbl + "\r\n", "");
      source = source.replaceAll(lbl + "\n", "");
    } catch {
      verbose && console.log("ERROR: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!processOutput... ", typeof source, source);
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