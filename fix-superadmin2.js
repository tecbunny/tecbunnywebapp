const fs = require('fs');
['offers/page.tsx', 'settings/page.tsx', 'policies/page.tsx', 'social-media/page.tsx'].forEach(p => {
  const file = 'apps/superadmin/src/app/superadmin/mgmt/' + p;
  if (fs.existsSync(file)) {
    const newContent = `export default function Page() {\n  return <div>Component moved or under construction</div>;\n}\n`;
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed', file);
  }
});
