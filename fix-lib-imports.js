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
      if (content.includes('@/lib/improved-email-service')) {
        content = content.replace(/@\/lib\/improved-email-service/g, '@tecbunny/core/improved-email-service');
        changed = true;
      }
      if (content.includes('@/lib/ai/gemini-service')) {
        content = content.replace(/@\/lib\/ai\/gemini-service/g, '@tecbunny/core/ai/gemini-service');
        changed = true;
      }
      if (content.includes('@/lib/ai/tax-classification')) {
        content = content.replace(/@\/lib\/ai\/tax-classification/g, '@tecbunny/core/ai/tax-classification');
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDir('./apps/mgmt/src');
processDir('./apps/public/src');
processDir('./apps/api/src');
processDir('./apps/superadmin/src');
console.log('Finished fixing imports');
