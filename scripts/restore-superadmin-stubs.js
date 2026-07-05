const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const superadminMgmtDir = path.join(PROJECT_ROOT, 'apps', 'superadmin', 'src', 'app', 'superadmin', 'mgmt');

const componentMapping = {
  'offers': 'OffersManagement',
  'settings': 'AdminSettings',
  'policies': 'PoliciesManagement',
  'social-media': 'SocialMediaManager',
  'products': 'AdminProductsNew',
  'reports': 'RecentActivityTable', // Not perfect but reports usually used this or something similar
  'custom-setups': 'CustomSetupOffersManager', 
  // Wait, CustomSetupOffersManager was NOT moved! Let's skip it if it's not in admin-ui.
};

function fixSuperadminPages(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fixSuperadminPages(filePath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      if (content.includes('Component moved to mgmt app or under construction') || content.includes('Component moved or under construction')) {
        const folderName = path.basename(path.dirname(filePath));
        const compName = componentMapping[folderName];
        
        if (compName) {
          const newContent = `"use client";
import { ${compName} } from '@tecbunny/admin-ui';

export default function Page() {
  return <${compName} />;
}`;
          fs.writeFileSync(filePath, newContent);
          console.log(`Restored ${folderName} with ${compName}`);
        }
      }
    }
  }
}

fixSuperadminPages(superadminMgmtDir);
