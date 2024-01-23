---
sidebar_position: 1
---

# Command Line Interface

This guide provides a user-oriented walkthrough of the CLI module of ipynb2web. For detailed API documentation, please refer to the [official documentation](https://karpatic.github.io/ipynb2web/jsdocs/module-cli.html)

## Installation

To install `ipynb2web`, run the following command:

```bash
npm install ipynb2web
```

## Usage Overview

The `ipynb2web` CLI provides three main commands to convert Jupyter notebooks (ipynb files) to various formats and create related assets. Execute it in the terminal as follows:

```bash
ipynb2web <COMMAND> <SAVETO> <FROM/or/SitemapName>
```

### Commands

1. **Convert Notebooks to JSON Documents**:
   This command processes directories containing `.ipynb` files, converting them to JSON documents and creating navigation JSON for each directory.

   ```bash
   ipynb2web DirectoryName "custom/SAVETO/path/" "custom/FROM/path/"
   ```

2. **Generate Sitemap**:
   The sitemap command creates a `Sitemap.txt` file from multiple section navigations. It is useful for SEO and website navigation purposes.

   ```bash
   ipynb2web sitemap "custom/sitemap/path.txt"
   ```

3. **Create Audio Assets**:
   This command generates audio versions of documents, provided that the `.ipynb` files include the necessary frontmatter. It requires the `OPENAI_API_KEY` to be stored in your `.env` file.

   ```bash
   ipynb2web audio "custom/SAVETO/path/" "custom/FROM/path/"
   ```

### Notes

- Ensure that the paths provided in the commands are accurate and accessible.
- The `OPENAI_API_KEY` is essential for the `audio` command to function correctly.
