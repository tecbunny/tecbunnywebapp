const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk('apps/api/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace static imports from '@/lib/...'
  // Note: some libs are in '@tecbunny/core' and some in '@tecbunny/core/server'.
  // Since api is all server-side, it's safer to import from '@tecbunny/core' or '@tecbunny/core/server'.
  // Actually, we can just replace '@/lib/logger' with '@tecbunny/core', '@/lib/supabase/server' with '@tecbunny/core/server'.
  
  const replacements = {
    '@/lib/logger': '@tecbunny/core',
    '@/lib/supabase/server': '@tecbunny/core/server',
    '@/lib/email': '@tecbunny/core/server', // maybe improvedEmailService?
    '@/lib/enhanced-commission-service': '@tecbunny/core/server',
    '@/lib/improved-email-service': '@tecbunny/core/server',
    '@/lib/otp-service': '@tecbunny/core/server',
    '@/lib/rate-limit': '@tecbunny/core/server',
    '@/lib/whatsapp-service': '@tecbunny/core/server', // will remove later if needed
    '@/lib/pdf-generator': '@tecbunny/core/server'
  };

  for (const [oldImport, newImport] of Object.entries(replacements)) {
    if (content.includes(oldImport)) {
      content = content.split(oldImport).join(newImport);
      changed = true;
    }
  }

  // Also replace @tecbunny/core/ai/* and @tecbunny/core/email/* which might not be exported correctly.
  // Wait, let's fix @tecbunny/core/ai/* -> @tecbunny/core/server? No, ai stuff is in packages/core/src/ai/. We need to export them!
  // Same for @tecbunny/core/email/* -> @tecbunny/core/server? No, we need to see what they are.

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed imports in', file);
  }
});
