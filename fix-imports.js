const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps/public/src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk(srcDir);
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace relative imports to moved lib files
  // e.g. import { logger } from '../../lib/logger';
  // => import { logger } from '@tecbunny/core';
  content = content.replace(/from\s+['"](?:\.\.\/)+lib\/(logger|session-manager|panel-routing|offer-discount-service|types|order-utils)['"]/g, "from '@tecbunny/core'");
  content = content.replace(/from\s+['"]\.\/logger['"]/g, "from '@tecbunny/core'");
  content = content.replace(/from\s+['"]\.\/types['"]/g, "from '@tecbunny/core'");
  content = content.replace(/from\s+['"]\.\/session-manager['"]/g, "from '@tecbunny/core'");
  content = content.replace(/from\s+['"]\.\/order-utils['"]/g, "from '@tecbunny/core'");
  
  // Also replace @/lib/ variants
  content = content.replace(/from\s+['"]@\/lib\/(logger|session-manager|panel-routing|offer-discount-service|types|order-utils)['"]/g, "from '@tecbunny/core'");

  // Replace @tecbunny/core/logger with @tecbunny/core
  content = content.replace(/from\s+['"]@tecbunny\/core\/logger['"]/g, "from '@tecbunny/core'");
  content = content.replace(/from\s+['"]@tecbunny\/core\/types['"]/g, "from '@tecbunny/core'");
  content = content.replace(/from\s+['"]@tecbunny\/core\/session-manager['"]/g, "from '@tecbunny/core'");

  // Fix orders/normalizers
  content = content.replace(/from\s+['"](?:@\/lib\/|(?:\.\.\/)+lib\/)orders\/normalizers['"]/g, "from '@tecbunny/core/orders/normalizers'");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
  }
});

console.log(`Updated ${changedCount} files.`);
