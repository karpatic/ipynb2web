import { createMarkdown } from './markdown.mjs';

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
function makeDetails(content, open, cellType = 'input') {
  const normalizedType = cellType === 'output' ? 'output' : 'input';
  const classes = `ipynb  ipynb-${normalizedType}`;
  return `<details class='${classes}' data-cell-type='${normalizedType}' ${open ? 'open' : ''}> <summary>${normalizedType === 'input' ? 'Code' : 'Output'}</summary> ${content}</details>`;
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
  const headerLevels = headers.split(',').map(h => parseInt(h.trim().slice(1))).sort((a, b) => a - b);

  // console.log('Header levels to collapse:', headerLevels);

  // Process from highest level (h2) to lowest (h6) to maintain hierarchy
  for (const level of headerLevels) {
    const headerPattern = `<(h${level})([^>]*)>([\\s\\S]*?)</\\1>`;
    const regex = new RegExp(headerPattern, 'gi');

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const [fullMatch, tag, attrs, headerText] = match;

      // Add content before this header
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      // Find content until next header of equal or higher significance (lower number)
      const nextHeaderRegex = new RegExp(`<h[1-${level}][^>]*>`, 'i');
      const searchStart = match.index + fullMatch.length;
      const nextMatch = nextHeaderRegex.exec(content.slice(searchStart));

      const contentEnd = nextMatch ? searchStart + nextMatch.index : content.length;
      const innerContent = content.slice(searchStart, contentEnd);

      parts.push(
        `<details${open ? ' open' : ''}>` +
        `<summary><${tag}${attrs}>${headerText}</${tag}></summary>` +
        innerContent +
        `</details>`
      );

      lastIndex = contentEnd;
      regex.lastIndex = contentEnd;
    }

    // Add remaining content
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    content = parts.join('');
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
    return output.replace?.('$1', capture) || output(match, capture);
  });
};

export { makeDetails, replaceEmojis, replaceAndLog, collapseHeaders };
// Compatibility utility: accepts Markdown source, not rendered HTML.
function convertNotes(source, startCount = 0, options = {}) {
  const md = createMarkdown(options, () => {}, () => null);
  const content = md.render(source, { docId: `notes-${startCount}` });
  const count = startCount + (content.match(/class="footnote-item"/g) ?? []).length;
  return { content, count };
}
export { convertNotes };
