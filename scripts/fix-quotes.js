const fs = require('fs');
const path = require('path');

function fixDoubleQuotes(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fixDoubleQuotes(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      let changed = false;
      if (content.includes("''@tecbunny/admin-ui'")) {
        content = content.replace(/''@tecbunny\/admin-ui'/g, "'@tecbunny/admin-ui'");
        changed = true;
      }
      if (content.includes('""@tecbunny/admin-ui"')) {
        content = content.replace(/""@tecbunny\/admin-ui"/g, "'@tecbunny/admin-ui'");
        changed = true;
      }
      if (content.includes('""@tecbunny/admin-ui\'')) {
        content = content.replace(/""@tecbunny\/admin-ui'/g, "'@tecbunny/admin-ui'");
        changed = true;
      }
      if (content.includes('\'\'@tecbunny/admin-ui\'')) {
        content = content.replace(/''@tecbunny\/admin-ui'/g, "'@tecbunny/admin-ui'");
        changed = true;
      }
      if (content.includes('\'"@tecbunny/admin-ui\'')) {
        content = content.replace(/'"@tecbunny\/admin-ui'/g, "'@tecbunny/admin-ui'");
        changed = true;
      }
      if (content.includes('"\'@tecbunny/admin-ui\'')) {
        content = content.replace(/"'@tecbunny\/admin-ui'/g, "'@tecbunny/admin-ui'");
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(filePath, content);
      }
    }
  }
}

fixDoubleQuotes(path.join('apps', 'mgmt', 'src', 'app', 'mgmt'));
fixDoubleQuotes(path.join('apps', 'mgmt', 'src', 'app', 'mgmt', 'manager'));
fixDoubleQuotes(path.join('apps', 'mgmt', 'src', 'app', 'mgmt', 'sales-staff'));
console.log('Fixed double quotes in mgmt app!');
