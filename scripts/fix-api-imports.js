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
  
  if (content.includes('@tecbunny/core/supabase-server')) {
    content = content.replace(/@tecbunny\/core\/supabase-server/g, '@tecbunny/core/supabase/server');
    changed = true;
  }
  if (content.includes('@tecbunny/core/auth/superadmin-session')) {
    content = content.replace(/@tecbunny\/core\/auth\/superadmin-session/g, '@tecbunny/core/server');
    changed = true;
  }
  if (content.includes('@tecbunny/core/logger')) {
    content = content.replace(/@tecbunny\/core\/logger/g, '@tecbunny/core');
    changed = true;
  }
  if (content.includes('createServiceClient')) {
    content = content.replace(/createServiceClient/g, 'createSupabaseServiceClient');
    changed = true;
  }
  if (content.includes('@tecbunny/core/errors')) {
    content = content.replace(/@tecbunny\/core\/errors/g, '@tecbunny/core');
    changed = true;
  }
  if (content.includes('@tecbunny/core/utils')) {
    content = content.replace(/@tecbunny\/core\/utils/g, '@tecbunny/core');
    changed = true;
  }
  if (content.includes('@tecbunny/core/supabase/admin')) {
    content = content.replace(/@tecbunny\/core\/supabase\/admin/g, '@tecbunny/core/server');
    changed = true;
  }
  if (content.includes('import { isSupabaseServiceConfigured } from \"@tecbunny/core\";')) {
    content = content.replace(/import \{ isSupabaseServiceConfigured \} from \"@tecbunny\/core\";/g, 'import { isSupabaseServiceConfigured } from \"@tecbunny/core/server\";');
    changed = true;
  }
  if (content.includes('isSupabaseServiceConfigured')) {
    if (content.match(/import \{[^}]*isSupabaseServiceConfigured[^}]*\} from [\"\']@tecbunny\/core[\"\']/)) {
       let matched = content.match(/import \{([^}]*)\} from [\"\']@tecbunny\/core[\"\']/g);
       if(matched) {
          matched.forEach(m => {
             if(m.includes('isSupabaseServiceConfigured')) {
                 let imports = m.replace(/import \{/, '').replace(/\} from [\"\']@tecbunny\/core[\"\']/, '').split(',').map(s => s.trim());
                 let coreImports = imports.filter(i => i !== 'isSupabaseServiceConfigured' && i !== 'createSupabaseServiceClient');
                 let serverImports = imports.filter(i => i === 'isSupabaseServiceConfigured' || i === 'createSupabaseServiceClient');
                 let replacement = '';
                 if (coreImports.length > 0) {
                     replacement += `import { ${coreImports.join(', ')} } from "@tecbunny/core";\n`;
                 }
                 if (serverImports.length > 0) {
                     replacement += `import { ${serverImports.join(', ')} } from "@tecbunny/core/server";`;
                 }
                 content = content.replace(m, replacement);
                 changed = true;
             }
          });
       }
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed imports in', file);
  }
});
