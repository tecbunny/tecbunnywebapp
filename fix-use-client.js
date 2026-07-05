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
      
      const useClientRegex1 = /^([^\n]+)\n[\s\n]*['"]use client['"];?/m;
      const useClientRegex2 = /(import[^;]+;)\s*\n*['"]use client['"];?/s;
      
      let lines = content.split('\n');
      let clientIndex = lines.findIndex(line => line.includes("'use client'") || line.includes('"use client"'));
      if (clientIndex > 0) {
        // move use client to the top
        let hasImportsBefore = false;
        for (let i = 0; i < clientIndex; i++) {
            if (lines[i].includes('import')) {
                hasImportsBefore = true;
                break;
            }
        }
        
        if (hasImportsBefore) {
            const clientLine = lines[clientIndex];
            lines.splice(clientIndex, 1);
            lines.unshift(clientLine);
            fs.writeFileSync(fullPath, lines.join('\n'));
            console.log('Fixed', fullPath);
        }
      }
    }
  }
}

processDir('./apps/mgmt/src');
processDir('./apps/public/src');
processDir('./apps/api/src');
processDir('./apps/superadmin/src');
console.log('Finished fixing use client');
