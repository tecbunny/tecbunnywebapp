const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}
const files = walk('apps/superadmin/src/app/superadmin/mgmt');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('@/app/mgmt/admin/')) {
    console.log('Fixing wrapper page:', file);
    const newContent = `export default function Page() {\n  return <div>Component moved to mgmt app or under construction</div>;\n}\n`;
    fs.writeFileSync(file, newContent, 'utf8');
  }
});
