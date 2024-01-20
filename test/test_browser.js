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
            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            <script>console.log(window.marked)</script> 
            <script src="/ipynb2web.browser.umd.js"></script>
        </head>
        <body> 
            <script> 
                console.log(window)
                const url = 'https://api.charleskarpati.com/vanillapivottable/index.ipynb';  
                // Either: 
                // ipynb2web.nb2json(url) 
                // or 
                ipynb2web.nb2json(url)
                    .then(result => { 
                        console.log(result);
                    })
                    .catch(error => { 
                        console.error(error);
                    });
            </script>
        </body>
        </html>
        `);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
