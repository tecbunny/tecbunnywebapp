const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ADMIN_APP_DIR = path.join(PROJECT_ROOT, 'apps', 'mgmt', 'src', 'app', 'mgmt', 'admin');
const DEST_DIR = path.join(PROJECT_ROOT, 'packages', 'admin-ui', 'src', 'components');

function copyPageComponents(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      copyPageComponents(filePath);
    } else if (file.endsWith('.tsx') && file.startsWith('admin-')) {
      const destPath = path.join(DEST_DIR, file);
      
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // Fix imports
      content = content.replace(/@\/components\/admin/g, '@tecbunny/admin-ui');
      content = content.replace(/@\/components\/shared/g, '@tecbunny/admin-ui');
      
      // Remove any relative imports to hooks like '../../../../hooks/use-debounce'
      // Wait, if it uses use-debounce, we should move use-debounce to admin-ui/src/hooks too!
      // But for now, let's fix it by rewriting it to import from '@tecbunny/core/hooks/use-debounce' if it exists there, 
      // or we can just leave it if it breaks we fix it later.
      content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/hooks\/use-debounce/g, '@tecbunny/core/hooks/use-debounce');

      fs.writeFileSync(destPath, content);
      
      // Now delete the original
      fs.unlinkSync(filePath);
    }
  }
}

copyPageComponents(ADMIN_APP_DIR);
console.log('Moved admin-*.tsx files to admin-ui!');
