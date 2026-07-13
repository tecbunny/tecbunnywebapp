const fs = require('fs');
const path = require('path');

function findPackageJsons(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.next' || file === 'dist') continue;
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findPackageJsons(filePath, fileList);
    } else if (file === 'package.json') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const packageJsons = findPackageJsons(path.join(__dirname, 'apps')).concat(findPackageJsons(path.join(__dirname, 'packages')));
const rootPackageJson = path.join(__dirname, 'package.json');
packageJsons.push(rootPackageJson);

const deps = {};

for (const pkgPath of packageJsons) {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const [dep, version] of Object.entries(allDeps)) {
      if (!deps[dep]) deps[dep] = {};
      const relativePath = path.relative(__dirname, pkgPath);
      if (!deps[dep][version]) deps[dep][version] = [];
      deps[dep][version].push(relativePath);
    }
  } catch (e) {}
}

const mismatches = Object.entries(deps).filter(([dep, versions]) => Object.keys(versions).length > 1);

console.log(`Found ${mismatches.length} dependencies with mismatched versions.`);
for (const [dep, versions] of mismatches) {
    if (dep.startsWith('@tecbunny/')) continue; // Ignore internal workspace linking mismatches if any
    if (Object.keys(versions).length > 1) {
        console.log(`\n${dep}:`);
        for (const [version, pkgs] of Object.entries(versions)) {
            console.log(`  ${version}: ${pkgs.join(', ')}`);
        }
    }
}
