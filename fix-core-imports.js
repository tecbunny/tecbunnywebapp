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
      
      const regex = /import\s+{([^}]*createServiceClient[^}]*)}\s+from\s+["']@tecbunny\/core["'];?/g;
      
      content = content.replace(regex, (match, importsStr) => {
        // We know we are in packages/core/src
        // let's just replace the import path to './supabase/server' or '../supabase/server' based on nesting
        let rel = './supabase/server';
        const depth = fullPath.split(path.sep).length - path.resolve('packages/core/src').split(path.sep).length;
        if (depth === 1) rel = '../supabase/server';
        if (depth === 2) rel = '../../supabase/server';
        
        return "import { " + importsStr.trim() + " } from '" + rel + "';";
      });

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('./packages/core/src');
console.log('Fixed createServiceClient in core');
