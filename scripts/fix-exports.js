const fs = require('fs');
const path = require('path');
const componentsDir = path.join('packages', 'admin-ui', 'src', 'components');
const sharedDir = path.join('packages', 'admin-ui', 'src', 'shared');

function toPascalCase(str) {
  return str.replace(/(^\w|-\w)/g, (clearAndUpper) => clearAndUpper.replace(/-/, "").toUpperCase());
}

const files = fs.readdirSync(componentsDir);
let exportsStr = '';
files.forEach(f => {
  if (f.endsWith('.tsx') || f.endsWith('.ts')) {
    const name = f.replace(/\.tsx?$/, '');
    const content = fs.readFileSync(path.join(componentsDir, f), 'utf-8');
    exportsStr += `export * from './components/${name}';\n`;
    if (content.includes('export default')) {
      let exportName = name;
      if (name.includes('-')) {
        exportName = toPascalCase(name);
      }
      exportsStr += `export { default as ${exportName} } from './components/${name}';\n`;
    }
  }
});

if (fs.existsSync(sharedDir)) {
  const sharedFiles = fs.readdirSync(sharedDir);
  sharedFiles.forEach(f => {
    if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      const name = f.replace(/\.tsx?$/, '');
      const content = fs.readFileSync(path.join(sharedDir, f), 'utf-8');
      exportsStr += `export * from './shared/${name}';\n`;
      if (content.includes('export default')) {
        let exportName = name;
        if (name.includes('-')) {
          exportName = toPascalCase(name);
        }
        exportsStr += `export { default as ${exportName} } from './shared/${name}';\n`;
      }
    }
  });
}

fs.writeFileSync(path.join('packages', 'admin-ui', 'src', 'index.tsx'), exportsStr);
console.log('Fixed index.tsx exports with PascalCase!');
