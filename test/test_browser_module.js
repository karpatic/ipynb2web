import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3111;

// Derive __dirname in ES module environment
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the 'dist' and 'public' directories
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, 'public')));


// return ./test.ipynb
app.get('/test.ipynb', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.ipynb'));
} );

// Route for the first method (Method 1)
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
    <script type="module" src="/ipynb2web.browser.mjs"></script>
</head>
<body>
    Inspect page source to see the code.<br>
    <a href="/method2">Go to: Browser Module Import Method 2</a><br>
    Metadata:
    <div id='output'></div>
    <script type="module">
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

// Route for the second method (Method 2)
app.get('/method2', (req, res) => {
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
</head>
<body>
    Inspect page source to see the code. <br>
    <a href="/">Go to: Browser Module Import Method 1 </a><br>
    Metadata:
    <div id='output'></div>
    <script type="module">
        import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
        const url = '/test.ipynb'; 
        import ipynb2web from '/ipynb2web.browser.mjs';
        ipynb2web.nb2json(url)
            .then(result => {
                const metaData = result.meta;
                const content = result.content;

                const metaBlock = document.createElement('pre');
                metaBlock.textContent = JSON.stringify(metaData, null, 2);

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
