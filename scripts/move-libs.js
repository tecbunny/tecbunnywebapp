const fs = require('fs');
const path = require('path');

const srcDir = 'apps/public/src/lib';
const destDir = 'packages/core/src';

function moveFiles(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      moveFiles(srcPath, destPath);
    } else {
      if (!fs.existsSync(destPath)) {
        fs.renameSync(srcPath, destPath);
        console.log(`Moved ${srcPath} to ${destPath}`);
      } else {
        console.log(`File already exists: ${destPath}`);
      }
    }
  }
}

moveFiles(srcDir, destDir);
