import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Derive __dirname in ES module environment
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the 'dist' and 'public' directories
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, 'public')));

// Route for the test page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            
            // Module import method 1
            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script> 
            <script type="module" src="/ipynb2web.browser.mjs"></script>  
        </head>
        <body>  
            
            <script type="module"> 
                // Module method 1 continued ...
                const url = 'https://api.charleskarpati.com/vanillapivottable/index.ipynb'; 
                ipynb2web.nb2json(url)
                    .then(result => { 
                        console.log(result);
                    })
                    .catch(error => { 
                        console.error(error);
                    });
            </script>
            <!--
            <script type="module"> 
                // Module import method 2
                import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
                const url = 'https://api.charleskarpati.com/vanillapivottable/index.ipynb'; 
                // Either
                // import ipynb2web from '/ipynb2web.browser.mjs'; 
                // ipynb2web.nb2json(url)
                // or
                import { Convert } from '/ipynb2web.browser.mjs'; 
                Convert.nb2json(url)
                    .then(result => { 
                        console.log(result);
                    })
                    .catch(error => { 
                        console.error(error);
                    });
            </script>-->
        </body>
        </html>`);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
