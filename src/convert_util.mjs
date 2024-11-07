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
 * @memberof module:convert_util
 */
function replaceAndLog(text, input, output) {
  return text.replace(input, function (match, capture) {
    return output.replace?.('$1', capture) || output(match, capture);
  });
};

export { makeDetails, replaceEmojis, convertNotes, replaceAndLog } 