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
      
      const regex = /import\s+\{([^}]*createServiceClient[^}]*)\}\s+from\s+['"]@tecbunny\/core['"];?/g;
      
      if (regex.test(content)) {
        // Find if there are other imports in that block. 
        // If it's just createServiceClient, we can replace the whole line.
        content = content.replace(regex, (match, p1) => {
            if (p1.trim() === 'createServiceClient') {
                return `import { createServiceClient } from "@tecbunny/core/server";`;
            } else {
                // If there are other things, split it.
                let others = p1.split(',').map(s => s.trim()).filter(s => s !== 'createServiceClient' && s !== '');
                return `import { ${others.join(', ')} } from "@tecbunny/core";\nimport { createServiceClient } from "@tecbunny/core/server";`;
            }
        });
        changed = true;
      }

      const regexClient = /import\s+\{([^}]*createClient[^}]*)\}\s+from\s+['"]@tecbunny\/core['"];?/g;
      if (regexClient.test(content)) {
        content = content.replace(regexClient, (match, p1) => {
            let names = p1.split(',').map(s => s.trim()).filter(s => s !== '');
            if (names.includes('createClient')) {
                if (names.length === 1) {
                    return `import { createClient } from "@tecbunny/core/client";`;
                } else {
                    let others = names.filter(s => s !== 'createClient');
                    return `import { ${others.join(', ')} } from "@tecbunny/core";\nimport { createClient } from "@tecbunny/core/client";`;
                }
            }
            return match;
        });
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDir('./apps/public/src');
processDir('./apps/api/src');
processDir('./apps/mgmt/src');
processDir('./apps/superadmin/src');
console.log('Finished');
