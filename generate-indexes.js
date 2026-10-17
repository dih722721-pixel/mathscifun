const fs = require('fs');
const path = require('path');

const EXCLUDED_DIRS = ['.git', '.github', 'node_modules'];

function generateHTML(folderName, files) {
    const listItems = files.map(file => {
        const relativePath = `./${encodeURIComponent(file)}`;
        return `
            <li class="list-item">
                <a class="file-link" href="${relativePath}">${file}</a>
                <span class="file-meta">Static File</span>
            </li>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${folderName} - Directory</title>
    <style>
        :root {
            --bg-color: #0d1117;
            --card-bg: #161b22;
            --accent-color: #58a6ff;
            --text-main: #c9d1d9;
            --text-muted: #8b949e;
            --border-color: #30363d;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .container { width: 100%; max-width: 800px; }
        .back-btn { display: inline-block; text-decoration: none; color: var(--accent-color); font-size: 14px; margin-bottom: 20px; font-weight: 500; }
        .back-btn:hover { text-decoration: underline; }
        header { border-bottom: 1px solid var(--border-color); padding-bottom: 15px; margin-bottom: 20px; }
        h1 { color: #ffffff; font-size: 1.8rem; margin: 0; }
        .list-group { background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 6px; padding: 0; margin: 0; list-style: none; }
        .list-item { border-bottom: 1px solid var(--border-color); padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; }
        .list-item:last-child { border-bottom: none; }
        .file-link { color: var(--accent-color); text-decoration: none; font-weight: 600; font-size: 15px; }
        .file-link:hover { text-decoration: underline; }
        .file-meta { font-size: 12px; color: var(--text-muted); }
    </style>
</head>
<body>
    <div class="container">
        <a href="../" class="back-btn">← Back to Main Directory</a>
        <header>
            <h1>${folderName}</h1>
            <p style="color: var(--text-muted); margin: 5px 0 0 0;">Directory index listing</p>
        </header>
        <ul class="list-group">
            ${listItems || '<li class="list-item"><span class="file-meta">No files found in this directory.</span></li>'}
        </ul>
    </div>
</body>
</html>`;
}

function processDirectory(targetDir) {
    const items = fs.readdirSync(targetDir);
    
    // Get directories to process
    const dirs = items.filter(item => {
        const fullPath = path.join(targetDir, item);
        return fs.statSync(fullPath).isDirectory() && !EXCLUDED_DIRS.includes(item);
    });

    // Generate an index for each subfolder
    dirs.forEach(dir => {
        const subFolderPath = path.join(targetDir, dir);
        const files = fs.readdirSync(subFolderPath).filter(file => {
            return fs.statSync(path.join(subFolderPath, file)).isFile() && file !== 'index.html';
        });

        const htmlContent = generateHTML(dir, files);
        fs.writeFileSync(path.join(subFolderPath, 'index.html'), htmlContent);
        console.log(`Generated automated index layout for: /${dir}`);
    });
}

processDirectory(process.cwd());
