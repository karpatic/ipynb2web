import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3112;

// Derive __dirname in ES module environment
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the 'dist' and 'public' directories
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, 'public')));

// return ./test.ipynb
app.get('/test.ipynb', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.ipynb'));
} );

// Route for the test page
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <style>
        pre {
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 4px;
            overflow: auto;
            font-family: "Courier New", Courier, monospace;
        }
        a {
            margin: 10px;
            display: inline-block;
            font-size: 16px;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="/ipynb2web.browser.umd.js"></script>
</head>
<body>
    Inspect page source to see the code.<br> 
    Metadata:
    <div id='output'></div>
    <script>
        const url = '/test.ipynb';
        ipynb2web.nb2json(url)
            .then(result => {
                // Extract meta data and content separately
                const metaData = result.meta;
                const content = result.content;

                // Create a preformatted block for meta data
                const metaBlock = document.createElement('pre');
                metaBlock.textContent = JSON.stringify(metaData, null, 2);

                // Inject meta data and content into the output div
                const outputDiv = document.getElementById('output');
                outputDiv.appendChild(metaBlock);
                outputDiv.innerHTML += "<div>" + content + "</div>";
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
