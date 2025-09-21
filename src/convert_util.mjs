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
  str = createSpans(str)
  return str
}









 
//  
// Markdown content will be prefaced with :::{#id .class} 
// Removes 'pre' and 'code' blocks while processing and then reinserts at end.
// check six layers deep. do this by first by creating an array of substrings that are wrapped by an opening and closing 
// ':::' * 6,  then within the resulting arrays, create sub arrays for ':::' * 5, and so on and so on, then handle each 
// one at ':::' * 1 and merge all the results back to the final form.
function createElement(str) {
  // 1. Shield existing <pre>/<code> blocks
  const codeBlocks = [];
  str = str.replace(/<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>/g, m => `__CODE_${codeBlocks.push(m)-1}__`);

  // helper to build the element
  const buildElement = (attrs, content) => {
    return `<div${buildAttrs(attrs)}>${content.trim()}</div>`
  };

  // helper to build id/class string
  const buildAttrs = attrs => {
    const idMatch = attrs.match(/#([A-Za-z0-9_-]+)/);
    const classMatches = [...attrs.matchAll(/\.([A-Za-z0-9_-]+)/g)].map(m => m[1]);
    return `${idMatch ? ` id="${idMatch[1]}"` : ''}${classMatches.length ? ` class="${classMatches.join(' ')}"` : ''}`;
  };

  // 2. process :::...::: blocks from 6 colons down to 1
  for (let level = 6; level > 0; level--) {
    const colons = ':'.repeat(level);
    const regex = new RegExp(
      `${colons}\\s*{\\s*([^}]*)}\\s*([\\s\\S]*?)\\s*${colons}`,
      'g'
    );
    str = str.replace(regex, (_, attrs, content) => buildElement(attrs, content.trim()) );
  }

  // 3. restore code blocks
  return str.replace(/__CODE_(\d+)__/g, (_, i) => codeBlocks[i]);
}


// test string: 
// "Here is an inline note.^[Inlines notes are easier to write, since you don't have to pick an identifier and move down to type the note.]"
function createInlineFootnotes(str) {
  let count = 0;
  return str.replace(/\^\[([\s\S]+?)\]/g, (_, text) => {
    console.log("Inline note:", text);
    count++;
    const label = `<label tabindex="0" for="note${count}" class="notelbl">[${count}]</label>`;
    return `<span class="note">
      <input type="checkbox" id="note${count}" class="notebox">
      ${label}
      <aside class="inline-note"> 
        ${label}
        ${text}
      </aside>
    </span>`;
  });
}


// Example: [This text is smallcaps]{.smallcaps #id} 
function createSpans(str) {
  // 1. Shield existing <pre>/<code> blocks
  const codeBlocks = [];
  str = str.replace(/<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>/g, m =>
    `__CODE_${codeBlocks.push(m) - 1}__`
  );

  // helper to build id/class string
  const buildAttrs = attrs => {
    const idMatch = attrs.match(/#([A-Za-z0-9_-]+)/);
    const classMatches = [...attrs.matchAll(/\.([A-Za-z0-9_-]+)/g)].map(m => m[1]);
    return `${idMatch ? ` id="${idMatch[1]}"` : ''}${classMatches.length ? ` class="${classMatches.join(' ')}"` : ''}`;
  };

  // 2. replace [text]{attrs} with <span ...>text</span>
  str = str.replace(
    /\[([^\]]*?)\]\s*\{\s*([^}]*)\}/g,
    (_, text, attrs) => `<span${buildAttrs(attrs)}>${text}</span>`
  );

  // 3. restore code blocks
  return str.replace(/__CODE_(\d+)__/g, (_, i) => codeBlocks[i]);
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
    return output.replace?.('$1', capture) || output(match, capture);
  });
};

export { makeDetails, replaceEmojis, convertNotes, replaceAndLog } 