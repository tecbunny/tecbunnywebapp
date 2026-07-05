const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedFiles = 0;
walkDir('apps/public/src', function(filePath) {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace all @/components/ui/XXX with @tecbunny/ui
        let newContent = content.replace(/(['"])@\/components\/ui\/[^'"\s;]+(['"])/g, '"@tecbunny/ui"');
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            modifiedFiles++;
        }
    }
});
console.log(`Refactored imports in ${modifiedFiles} files.`);
