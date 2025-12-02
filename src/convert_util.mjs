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
  return `<details class='${classes}' data-cell-type='${normalizedType}' ${open ? 'open' : ''}> <summary></summary> ${content}</details>`;
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
 * @param {number} startCount - The starting count for footnotes.
 * @returns {Object} Object with content and updated count.
 * @memberof module:convert_util
 */
function convertNotes(str, startCount = 0) {
  // console.log("Converting notes", str);
  str = createElement(str); // :::{#id .class} ... :::
  const result = createInlineFootnotes(str, startCount); // inline notes ^[This is an inline note.]
  str = createSpans(result.content) // [This text is smallcaps]{.smallcaps #id}
  return { content: str, count: result.count }
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








 
//  
// Markdown content may be prefaced with :::{#id .class} 
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



// test string: 
// "Here is an inline note.^[Inlines notes are easier to write, since you don't have to pick an identifier and move down to type the note.]{.tip}"
function createInlineFootnotes(str, startCount = 0) {
  // 1. Shield existing <pre>/<code> blocks and inline code
  const codeBlocks = [];
  str = str.replace(/<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>|`[^`]+`/g, m =>
    `__CODE_${codeBlocks.push(m) - 1}__`
  );

  let count = startCount;
  
  const parseAttrs = attrs => {
    const cleaned = attrs?.trim();
    if (!cleaned) {
      return { id: null, classes: [] };
    }

    const idMatch = cleaned.match(/#([A-Za-z0-9_-]+)/);
    const classMatches = [...cleaned.matchAll(/\.([A-Za-z0-9_-]+)/g)].map(m => m[1]);

    return {
      id: idMatch ? idMatch[1] : null,
      classes: classMatches
    };
  };

  const buildAttrString = (attrs = {}, baseClasses = []) => {
    const mergedClasses = [...new Set([...(baseClasses || []), ...((attrs.classes) || [])])].filter(Boolean);
    const idStr = attrs.id ? ` id="${attrs.id}"` : '';
    const classStr = mergedClasses.length ? ` class="${mergedClasses.join(' ')}"` : '';
    return `${idStr}${classStr}`;
  };
  
  // Replace inline notes with optional {.class #id} attributes
  str = str.replace(/\^\[([\s\S]+?)\](?:\s*\{\s*([^}]*)\})?/g, (_, text, attrs) => {
    // console.log("Inline note:", text, "attrs:", attrs);
    count++;
    const label = `<label tabindex="0" for="note${count}" class="notelbl">[${count}]</label>`;
    const parsedAttrs = parseAttrs(attrs);
    const wrapperAttrs = buildAttrString(parsedAttrs, ['note']);
    const inlineNoteAttrs = buildAttrString({ classes: parsedAttrs.classes }, ['inline-note']);
    
    // Return the trigger with its associated aside as siblings
    // Apply custom attributes to the outer wrapper span
    return `<span${wrapperAttrs}>
      <input type="checkbox" id="note${count}" class="notebox">
      ${label}
      <span${inlineNoteAttrs}>
        ${label}
        ${text}
      </span>
    </span>`;
  });
  
  // 4. Restore code blocks
  str = str.replace(/__CODE_(\d+)__/g, (_, i) => codeBlocks[i]);
  
  return { content: str, count };
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

export { makeDetails, replaceEmojis, convertNotes, replaceAndLog, collapseHeaders };