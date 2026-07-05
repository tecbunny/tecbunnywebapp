const fs = require('fs');
const path = require('path');

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let changed = false;
      
      // Fix '@/lib/...' imports to '@tecbunny/core/...'
      const fixes = [
        ['@/lib/auth/superadmin-session', '@tecbunny/core/auth/superadmin-session'],
        ['@/lib/order-utils', '@tecbunny/core/order-utils'],
        ['@/lib/roles', '@tecbunny/core/roles']
      ];
      
      for (const [find, replace] of fixes) {
        if (content.includes(find)) {
          content = content.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDir('./apps/public/src');
// also middleware
let mwContent = fs.readFileSync('./apps/public/middleware.ts', 'utf8');
let mwChanged = false;
const mwFixes = [
  ['@/lib/auth/superadmin-session', '@tecbunny/core/auth/superadmin-session'],
  ['@/lib/order-utils', '@tecbunny/core/order-utils'],
  ['@/lib/roles', '@tecbunny/core/roles'],
  ['@/lib/supabase/env', '@tecbunny/core/supabase/env'] // Just in case
];
for (const [find, replace] of mwFixes) {
  if (mwContent.includes(find)) {
    mwContent = mwContent.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
    mwChanged = true;
  }
}
if (mwChanged) {
  fs.writeFileSync('./apps/public/middleware.ts', mwContent);
  console.log('Fixed apps/public/middleware.ts');
}

// Update packages/core/package.json
let pkgJsonStr = fs.readFileSync('./packages/core/package.json', 'utf8');
const pkgJson = JSON.parse(pkgJsonStr);
pkgJson.exports['./context/AppProvider'] = './src/context/AppProvider.tsx';
pkgJson.exports['./context/OrderProvider'] = './src/context/OrderProvider.tsx';
pkgJson.exports['./context/AuthProvider'] = './src/context/AuthProvider.tsx';
fs.writeFileSync('./packages/core/package.json', JSON.stringify(pkgJson, null, 2));
console.log('Updated core package.json exports');

