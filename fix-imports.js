const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for createClient as createServerClient in @tecbunny/core
      const importRegex = /import\s+{[^}]*createClient\s+as\s+createServerClient[^}]*}\s+from\s+["']@tecbunny\/core["'];?/g;
      
      content = content.replace(importRegex, (match) => {
        // Remove createClient as createServerClient from the core import
        let newMatch = match.replace(/,\s*createClient\s+as\s+createServerClient/g, '')
                            .replace(/createClient\s+as\s+createServerClient\s*,/g, '')
                            .replace(/{\s*createClient\s+as\s+createServerClient\s*}/g, '{}');
                            
        // If the core import is now empty, remove it completely
        if (newMatch.includes('{}')) {
            newMatch = '';
        }

        // Add the new import
        const newImport = "import { createClient as createServerClient } from \"@tecbunny/core/supabase/server\";\n";
        
        return newImport + newMatch;
      });

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('./apps/api/src/app/api');
console.log('Fixed createServerClient imports');
