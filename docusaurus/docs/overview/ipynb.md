---
sidebar_position: 1
---

# IPYNB Guide

Leverage ipynb2web's full potential by utilizing specific flags, markup, and YAML metadata in your Jupyter notebooks. This guide outlines how to effectively format your notebook for optimal conversion and presentation.

## YAML Metadata

Place YAML metadata at the beginning of your notebook to define key information:

- `# Title`: Set the title of your notebook.
- `> Summary`: Provide a concise summary or description.
- Key-Value Pairs:
  - `author`: Specify the author's name.
  - `date`: Indicate the creation or modification date.
  - `tags`: List relevant tags or keywords.
  - `category`: Categorize the notebook's content.
  - `prettify`: Enable code prettification by setting this to `true`.
  - `export`: Mark cells for export with this flag.

## Markdown Enhancements

Enhance text cells with special syntax for added functionalities:

- **Footnotes**: Use standard Markdown footnote syntax to create references and notes.
- **Breakouts**: Insert side comments or notes using `(((key::value)))` syntax.
- **HTML Embedding**: Markdown cells can contain HTML code for complex layouts or custom styling.

## Source Code Flags

Include these tags at the beginning of any code cell for specific behaviors:

- `#collapse_input_open`: Collapse the code cell but leave it open initially.
- `#collapse_input`: Collapse the code cell and keep it closed initially.
- `#collapse_output_open`: Collapse the output cell but leave it open initially.
- `#collapse_output`: Collapse the output cell and keep it closed initially.
- `#hide_input`: Completely hide the code cell.
- `#hide_output`: Completely hide the output cell.
- `#hide`: Hide both the code and output cells.
- `%%capture`: Capture the output of the cell without displaying it.
- `%%javascript`: Execute the cell's content as JavaScript.
- `%%html`: Render the cell's content as HTML.
- `#export`: Flag the cell's content for export.

## Code Cell Processing

ipynb2web processes code cells based on the provided flags and content type:

- **Code Execution**: Normal execution with output rendered based on the cell's content type.
- **Special Handling**: Cells flagged with `%%javascript` or `%%html` are treated as raw JavaScript or HTML respectively.
- **Prettification**: If `prettify` is enabled in YAML, code blocks are styled for readability.

## Emoji Conversion

In both Markdown and code cells, emojis are converted to HTML entities for consistent rendering across platforms.

## Note Conversion

Special note syntax in Markdown cells (`(((note::Your note content here)))`) is transformed into interactive HTML breakout elements for a more engaging presentation.

You can use the prefixes `note`, `warning`, `alert`. Three ellipses without prefix or `::` will create a footnote.

By following these guidelines, you can ensure that your Jupyter notebooks are optimally formatted for conversion and display using ipynb2web.
