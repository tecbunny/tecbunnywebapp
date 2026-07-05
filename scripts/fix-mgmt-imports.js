const fs = require('fs');
const path = require('path');

function replaceImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      replaceImports(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      let changed = false;
      if (content.includes('@/components/admin')) {
        content = content.replace(/@\/components\/admin\/(.+?)['"]/g, (match, p1) => {
          return `'@tecbunny/admin-ui'`;
        });
        changed = true;
      }
      if (content.includes('@/components/shared')) {
        content = content.replace(/@\/components\/shared\/(.+?)['"]/g, (match, p1) => {
          return `'@tecbunny/admin-ui'`;
        });
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(filePath, content);
      }
    }
  }
}

replaceImports(path.join('apps', 'mgmt', 'src', 'app', 'mgmt'));
replaceImports(path.join('apps', 'mgmt', 'src', 'app', 'mgmt', 'manager'));
replaceImports(path.join('apps', 'mgmt', 'src', 'app', 'mgmt', 'sales-staff'));
console.log('Fixed imports in mgmt app!');
