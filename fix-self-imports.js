const fs = require('fs');
const path = require('path');

const filesToFix = [
  'packages/core/src/auth/admin-guard.ts',
  'packages/core/src/improved-email-service.ts',
  'packages/core/src/offer-discount-service.ts',
  'packages/core/src/rate-limit.ts'
];

filesToFix.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // We only replace exact `@tecbunny/core` with `../index` or `./index` depending on the folder level.
  // Wait, it's easier to just use `..` or `.`
  const dir = path.dirname(file);
  const levels = dir.split('/').length - 3; // 'packages/core/src' is 3 parts
  let relativePath = levels === 0 ? '.' : Array(levels).fill('..').join('/');

  content = content.replace(/from\s+['"]@tecbunny\/core['"]/g, `from '${relativePath}'`);
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
