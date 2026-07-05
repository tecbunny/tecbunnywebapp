const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}
const files = walk('apps/superadmin/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (content.includes('requireSuperadminContext') && content.includes('@tecbunny/core')) {
    content = content.replace(/import\s+\{\s*requireSuperadminContext\s*\}\s+from\s+['"]@tecbunny\/core['"]/, 'import { requireSuperadminContext } from "@tecbunny/core/server"');
    changed = true;
  }
  if (content.includes('verifySuperadminSessionToken') && content.includes('@tecbunny/core')) {
    content = content.replace(/import\s+\{\s*verifySuperadminSessionToken\s*\}\s+from\s+['"]@tecbunny\/core['"]/, 'import { verifySuperadminSessionToken } from "@tecbunny/core/server"');
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed auth import:', file);
  }
});
