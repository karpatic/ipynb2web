# FAQ

### What is ipynb2web?

Ipynb2web is a tool designed to convert Interactive Python Notebooks (.ipynb) into web-ready, static assets compatible with various templates.

### What makes ipynb2web unique?

Unlike other tools like Pandoc or Sphinx, ipynb2web allows for the inclusion of `yaml` metadata, special `#flags` for output formatting, and the addition of minimally opinionated content through specific `markup`.

## Usage

### How do I install ipynb2web?

For Node.js environments:

```bash
npm install ipynb2web
```

### How do I convert a Jupyter notebook to JSON using ipynb2web?

```javascript
const preparedJsonAsset = ipynb2web.nb2json(url);
// Returns: { meta: { ... }, content: { ... } }
```

### Can I use ipynb2web in the browser?

Yes, ipynb2web can be included via CDN and used to convert notebooks to JSON in the browser.

## Features and Functionality

### What core features does ipynb2web offer?

1. Conversion of .ipynb documents to JSON for web templates.
2. Rendering of assets on the server or browser.
3. Custom template creation and integration.
4. Automated handling of intricate details like system logs and error messages.

### How does ipynb2web handle Markdown and code cells?

Markdown cells support footnotes, breakouts, and HTML embedding. Code cells can be processed with flags for specific behaviors like collapsing, hiding, or executing JavaScript/HTML.

### What are some key commands in the ipynb2web CLI?

- Convert notebooks to JSON: `ipynb2web DirectoryName "custom/SAVETO/path/" "custom/FROM/path/"`
- Generate a sitemap: `ipynb2web sitemap "custom/sitemap/path.txt"`
- Create audio assets: `ipynb2web audio "custom/SAVETO/path/" "custom/FROM/path/"`

## Troubleshooting

### What if my notebook isn't converting properly?

Ensure that the YAML metadata is correctly formatted and that the notebook follows the guidelines for flags and markup.

### How can I get detailed API documentation?

Visit the official documentation: [ipynb2web API Documentation](https://karpatic.github.io/ipynb2web/jsdocs)

## Contact and Support

### How can I report an issue or request a feature?

Issues and feature requests can be submitted through the project's GitHub repository.

### Where can I find more examples and usage instructions?

For comprehensive guides and examples, visit the official website: [ipynb2web Documentation](https://karpatic.github.io/ipynb2web/docs/overview)
