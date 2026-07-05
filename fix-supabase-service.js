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
      
      const regex = /import\s+\{([^}]*isSupabaseServiceConfigured[^}]*)\}\s+from\s+['"]@tecbunny\/core['"];?/g;
      
      if (regex.test(content)) {
        content = content.replace(regex, (match, p1) => {
            if (p1.trim() === 'isSupabaseServiceConfigured') {
                return `import { isSupabaseServiceConfigured } from "@tecbunny/core/server";`;
            } else {
                let others = p1.split(',').map(s => s.trim()).filter(s => s !== 'isSupabaseServiceConfigured' && s !== '');
                return `import { ${others.join(', ')} } from "@tecbunny/core";\nimport { isSupabaseServiceConfigured } from "@tecbunny/core/server";`;
            }
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
