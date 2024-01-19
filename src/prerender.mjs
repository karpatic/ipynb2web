/** 
 *  @fileOverview Server side functions for ipynb2web like createSitemap, createAudio
 *
 *  @author       Charles Karpati
 */

import fs from 'fs';
import path from 'path';
import httpServer from "http-server";

/** 
 * Checks YAML for `audio` tag and creates the file
 *
 * @async
 * @param {string} [from='./src/client/posts/'] - The source directory containing content to be converted to audio.
 * @param {string} [to='./src/client/audio/'] - The target directory where audio files will be saved.
 */

async function createAudio(from = './src/client/posts/', to = './src/client/audio/') {
  const { speechFromDir } = await import(/* webpackChunkName: "audio" */ './create_audio.mjs');
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

async function createSitemap(SAVETO = './src/client/posts/', sitemapFile = './sitemap.txt', verbose = false) {
  let pages = [];
  verbose && console.log(`\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ START createSitemap \n\n`)
  await processDirectory(pages, SAVETO, '');
  try {
    await fs.writeFile(sitemapFile, pages.join('\n') + '\n');
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
async function processDirectory(pages, directory, subdir = '', verbose = false) {
  const stat = await fs.stat(directory);
  if (!stat.isDirectory()) {
    verbose && console.log('\n\n UNABLE TO PROCESS DIRECTORY: ', directory, subdir);
    return;
  }

  const files = await fs.readdir(directory);
  await Promise.all(files.filter(file => file.includes('_map.json')).map(async file => {
    const filePath = path.join(directory, file);
    const jsonData = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    jsonData.forEach(obj => {
      if (obj.filename) {
        pages.push(`http://www.charleskarpati.com/${file.split('_')[0].split('.')[0]}/${subdir ? subdir + '/' : ''}${obj.filename}`);
      }
    });
  }));

  // recursively process subdirectories
  await Promise.all(files.filter(file => !path.extname(file)).map(file => {
    return processDirectory(pages, path.join(directory, file), path.join(subdir, file));
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

async function cli_nbs2html(FROM = './src/ipynb/', directory, SAVETO = './src/client/posts/', verbose = false) {
  // Search the pathto directory for .ipynb files
  verbose && console.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ cli_nbs2html: start: ${FROM}${directory}/`)
  const stat = await fs.stat(`${FROM}${directory}/`);
  if (!stat.isDirectory()) {
    verbose && console.log('\n\n UNABLE TO PROCESS DIRECTORY: ', directory, subdir);
    return;
  }
  let pages = (await fs.readdir(`${FROM}${directory}/`))
    .filter((file) => path.extname(file) === ".ipynb")
    .map((file) => path.parse(file).name); // filename without extension
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

async function generate_sectionmap(pages, FROM, directory, SAVETO, verbose = false) {
  verbose && console.log(`\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ cli_nbs2html: generate_sectionmap: `, pages, directory, verbose = false)
  const server = httpServer.createServer({
    root: "./",
    cors: true,
    host: "0.0.0.0",
  });

  server.listen(8085, () => { });
  let links = [];

  // Create saveto directory if it doesn't exist
  try {
    await fs.access(`${SAVETO}${directory}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      try {
        await fs.mkdir(`${SAVETO}${directory}`, { recursive: true });
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
    } = (await ipynb_publish(`${FROM}${directory}`, SAVETO))
        .meta;
    links.push(rest);
  }

  for (const page of pages) {
    const r = !page.startsWith("_") && await ipynb_publish(`${FROM}${directory}/${page}`, `${SAVETO}${directory}`);
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
    await fs.writeFile(sitemapPath, JSON.stringify(links));
  } catch (e) {
    await fs.writeFile(sitemapPath, "{}");
    verbose && console.log("----ERROR:", r.meta);
  }
  server.close(() => { verbose && console.log("Server closed."); });
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
async function ipynb_publish(
  fullFilePath,
  saveDir,
  type = "json"
) {

  let final;
  if (type === "json") {
    const { nb2json } = await import(/* webpackChunkName: "convert" */ "./convert.mjs");
    final = await nb2json(fullFilePath);
  }

  let pyCode = final.meta.pyCode;
  if (pyCode?.length) {
    let file = path.basename(fullFilePath, '.ipynb'); // Extracts filename without extension
    file = file.replace(/^\d{2}_/, ''); // Remove XX_ prefix
    file = final.meta.default_exp || file; // Use default export name if available

    // Construct the path for Python code file
    let pyCodeFilePath = path.join(saveDir, `${file}.py`);
    let txt = pyCode.join('\n').replace(/(^|\n) /g, '$1');
    await fs.writeFile(pyCodeFilePath, txt);
  }

  delete final.meta.pyCode;

  // Save the final file in the specified format
  const t = path.join(saveDir, `${final.meta.filename}.${type}`);
  try {
    await fs.writeFile(t, type === "json" ? JSON.stringify(final) : final);
  } catch (e) {
    console.log("ERROR writing file:", t);
  }
  return final;
}

export { createAudio, createSitemap, cli_nbs2html } // ES6 exports