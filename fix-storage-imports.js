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
const apps = ['apps/public/src', 'apps/superadmin/src', 'apps/waba/src'];
let files = [];
apps.forEach(app => {
  if (fs.existsSync(app)) files = files.concat(walk(app));
});
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('uploadToSupabase') || content.includes('uploadFavicon') || content.includes('uploadLogo') || content.includes('uploadProductImage') || content.includes('deleteFromSupabase') || content.includes('getSupabaseSignedUrl')) {
    console.log('Needs fixing for storage:', file);
    if (content.includes('@tecbunny/core')) {
      content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]@tecbunny\/core['"]/g, (match, imports) => {
        // extract storage imports
        const storageFuncs = ['uploadToSupabase', 'uploadFavicon', 'uploadLogo', 'uploadProductImage', 'deleteFromSupabase', 'getSupabaseSignedUrl'];
        let storageImports = [];
        let otherImports = [];
        imports.split(',').forEach(imp => {
          const t = imp.trim();
          if (storageFuncs.includes(t)) {
            storageImports.push(t);
          } else if (t) {
            otherImports.push(t);
          }
        });
        
        if (storageImports.length > 0) {
          let res = '';
          if (otherImports.length > 0) {
            res += `import { ${otherImports.join(', ')} } from '@tecbunny/core';\n`;
          }
          res += `import { ${storageImports.join(', ')} } from '@tecbunny/core/supabase/storage';`;
          return res;
        }
        return match;
      });
      fs.writeFileSync(file, content, 'utf8');
    }
  }
});
