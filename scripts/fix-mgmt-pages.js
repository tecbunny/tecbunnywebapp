const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

// 1. Fix mgmt app pages
const mgmtAdminDir = path.join(PROJECT_ROOT, 'apps', 'mgmt', 'src', 'app', 'mgmt', 'admin');

function fixMgmtPages(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fixMgmtPages(filePath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // Look for imports like import X from './admin-something' or import X from '@/components/admin/X'
      content = content.replace(/import (\w+) from '.\/admin-([^']+)';/g, "import { Admin$2 as $1 } from '@tecbunny/admin-ui';");
      content = content.replace(/import {([^}]+)} from '.\/admin-([^']+)';/g, "import { $1 } from '@tecbunny/admin-ui';");
      content = content.replace(/import (\w+) from '@\/components\/admin\/([^']+)';/g, "import { $1 } from '@tecbunny/admin-ui';");
      
      fs.writeFileSync(filePath, content);
    }
  }
}
fixMgmtPages(mgmtAdminDir);

// 2. Fix superadmin app pages
const superadminMgmtDir = path.join(PROJECT_ROOT, 'apps', 'superadmin', 'src', 'app', 'superadmin', 'mgmt');

function fixSuperadminPages(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fixSuperadminPages(filePath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // If it's a stub, we need to know what to replace it with.
      // This is tricky, so let's do it manually for superadmin.
    }
  }
}

console.log('Fixed mgmt pages!');
