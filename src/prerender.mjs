/**
 * @fileOverview Provides functionalities for processing Jupyter Notebook files (.ipynb) 
 * 
 * The module serves as the core of the ipynb2web conversion pipeline, handling various stages of content transformation and site structure generation. This includes converting notebooks to HTML, creating audio files from specified content, generating sitemaps for web navigation, and publishing processed files. 
 * 
 * Functions exposed from [node](module-Ipynb2web_node.html) and [cli](module-Ipynb2web_cli.html) into different web formats and managing related assets. 
 * @module prerender
 * @exports {Object} - Exports functions like createAudio, createSitemap, and cli_nbs2html for processing Jupyter Notebooks and related assets.
 * @author Charles Karpati
 */


import fs from 'fs';
import path from 'path';
import httpServer from "http-server";

/** 
 * Checks YAML for `audio` tag and creates the file
 *
 * @async
 * @memberof module:prerender
 * @param {string} [from='./src/posts/'] - The source directory containing content to be converted to audio.
 * @param {string} [to='./src/client/audio/'] - The target directory where audio files will be saved.
 */

async function createAudio(from = './src/posts/', to = './src/client/audio/') {
  const { speechFromDir } = await import(/* webpackChunkName: "audio" */ './create_audio.mjs');
  speechFromDir(from, to);
}

/**
 * Appends each ipynb to sitemap.txt by calling [process Directory](module-prerender.html#.processDirectory).
 *
 * @async
 * @memberof module:prerender
 * @param {string} [search='./'] - The directory to search for JSON map files.
 * @param {string} [sitemapFile='./sitemap.txt'] - The file path where the sitemap will be saved.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; processes and writes to the sitemap file directly.
 * @throws {Error} Logs an error to the console if there is a failure in writing the sitemap file and verbose is true.
 */

async function createSitemap(search='./', sitemapFile = './sitemap.txt', verbose = true) { 
  verbose && console.log(`\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ START createSitemap \n\n`) 
  const pages = await processDirectory(search, '', verbose);
  console.log('pages', pages)
  try {  
    await fs.promises.writeFile(sitemapFile, pages.join('\n') + '\n');
    verbose && console.log('Sitemap file created successfully:', sitemapFile);
  } catch (err) {
    verbose && console.error(`Error creating or truncating sitemap file: ${sitemapFile}`, err);
  }
}

/**
 * Recursively searches for _map.json files created from [[cli_nbs2html](module-prerender.html#.cli_nbs2html)->[generate_sectionmap](module-prerender.html#.generate_sectionmap) and appends the mappings to sitemap.txt.
 *
 * @async
 * @memberof module:prerender 
 * @param {string} directory - The directory to process.
 * @param {string} [subdir=''] - A subdirectory path to append to each URL in the sitemap.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {Array<string>} - An array to accumulate page URLs for the sitemap.
 * @throws {Error} Logs an error to the console if unable to process a directory and verbose is true.
 */
async function processDirectory(directory, subdir = '', verbose = false) {
  let pages = [];
  console.log('prossdir', { directory, subdir });
  
  const stat = await fs.promises.stat(directory);
  if (!stat.isDirectory()) {
    verbose && console.log('\n\n UNABLE TO PROCESS DIRECTORY: ', directory, subdir);
    return pages;
  }

  const files = await fs.promises.readdir(directory);

  // Process files that include '_map.json'
  await Promise.all(files.filter(file => file.includes('_map.json')).map(async file => {
    const filePath = path.join(directory, file);
    const jsonData = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));

    jsonData.forEach(obj => {
      if (obj.filename) {
        pages.push(`/${file.split('_')[0].split('.')[0]}/${subdir ? subdir + '/' : ''}${obj.filename}`);
      }
    });
  }));

  // Recursively process directories
  for (const file of files.filter(file => !path.extname(file))) {
    const subPages = await processDirectory(path.join(directory, file), '', verbose);
    pages = pages.concat(subPages);
  }

  return pages;
}


/**
 * Calls [generate_sectionmap](module-prerender.html#.generate_sectionmap) for each file in directory.
 *
 * @async
 * @memberof module:prerender
 * @param {string} [FROM='./'] - The directory containing .ipynb files to process.
 * @param {string} directory - A subdirectory to process within the FROM path.
 * @param {string} [SAVETO='./'] - The directory where the processed files will be saved.
 * @param {boolean} [verbose=false] - If set to true, enables verbose logging for detailed information.
 * @returns {void} Does not return a value; the function is used for processing files in place.
 * @throws {Error} Logs an error to the console if unable to process the specified directory and verbose is true.
 */

async function cli_nbs2html(FROM, directory, SAVETO, verbose = false) {
  FROM ||= './';
  SAVETO ||= './';
  // Search the pathto directory for .ipynb files
  verbose && console.log(`\n~ ~ ~ cli_nbs2html: ${FROM}${directory}\n`)
  // const stat = await fs.promises.stat(`${FROM}${directory}/`);
  const stat = await fs.promises.stat(`${FROM}${directory}/`);
  if (!stat.isDirectory()) {
    verbose && console.log('\n\n UNABLE TO PROCESS DIRECTORY: ', directory, subdir);
    return;
  } 
  let pages = (await fs.promises.readdir(`${FROM}${directory}/`))
    .filter((file) => path.extname(file) === ".ipynb")
    .map((file) => path.parse(file).name ); // filename without extension 
  generate_sectionmap(pages, FROM, directory, SAVETO, verbose);
}

/**
 * Calls [ipynb_publish](module-prerender.html#.ipynb_publish) on all files in the directory. 
 * - Also creates section_map.json which is later used in createSitemap()
 * - It excludes specified metadata fields from section_map.json
 * - Skips _filename.ipynb files entirely and won't add meta.hide yaml's to the section_map.json
 *
 * @async
 * @memberof module:prerender
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
    await fs.promises.access(`${SAVETO}${directory}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      try {
        await fs.promises.mkdir(`${SAVETO}${directory}`, { recursive: true });
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

  // Call ipynb_publish and save for each page
  for (const page of pages) {
    // Skip files that start with an underscore
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
    await fs.promises.writeFile(sitemapPath, JSON.stringify(links));
  } catch (e) {
    await fs.promises.writeFile(sitemapPath, "{}");
    verbose && console.log("----ERROR:", r.meta);
  }
  server.close(() => { verbose && console.log("Server closed."); });
}

/**
 * Processes and publishes a Jupyter Notebook file, converting it to the specified format and saving it to a directory.
 * Optionally, extracts and saves Python code from the notebook.
 *
 * @async
 * @memberof module:prerender
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
    if(final?.meta?.title == 'Meta Quest Notes')  {
      console.log('final', final)
    }
  }

  let pyCode = final.meta.pyCode;
  if (pyCode?.length) {
    let file = path.basename(fullFilePath, '.ipynb'); // Extracts filename without extension
    file = file.replace(/^\d{2}_/, ''); // Remove XX_ prefix
    file = final.meta.default_exp || file; // Use default export name if available

    // Construct the path for Python code file
    let pyCodeFilePath = path.join(saveDir, `${file}.py`);
    let txt = pyCode.join('\n').replace(/(^|\n) /g, '$1');
    await fs.promises.writeFile(pyCodeFilePath, txt);
  }

  delete final.meta.pyCode;

  // Save the final file in the specified format
  const t = path.join(saveDir, `${final.meta.filename}.${type}`);
  try {
    await fs.promises.writeFile(t, type === "json" ? JSON.stringify(final) : final);
  } catch (e) {
    console.log("ERROR writing file:", t);
  }
  return final;
}

export { createAudio, createSitemap, cli_nbs2html }