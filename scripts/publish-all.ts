import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

function readJSONFile(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

try {
  // Test and lint:
  execSync('npm run test && npm run lint', { stdio: 'inherit' });

  // Clean, Build and Publish for common JS version ("iteragain"):
  execSync('npm run build:clean && npm run build && npm publish', { stdio: 'inherit' });


  // Clean, Build for ES modules:
  execSync('npm run build:clean && npm run build:es', { stdio: 'inherit' });

  // Modify package.json and package-lock.json for ES modules version ("iteragain-es") publish:
  const packageJSONPath = join(__dirname, '../package.json');
  const packageLockJSONPath = join(__dirname, '../package-lock.json');
  const packageJSON = readJSONFile(packageJSONPath);
  const packageLockJSON = readJSONFile(packageLockJSONPath);
  const readmePath = join(__dirname, '../README.md');
  const readmeESPath = join(__dirname, '../README.es.md');
  packageJSON.name = packageLockJSON.name = 'iteragain-es';
  packageJSON.type = 'module';
  packageJSON.homepage += '-es';
  packageJSON.sideEffects = false;
  writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2));
  writeFileSync(packageLockJSONPath, JSON.stringify(packageLockJSON, null, 2));
  writeFileSync(readmePath, readFileSync(readmeESPath, 'utf8'));

  execSync('npm publish', { stdio: 'inherit' });
} finally {
  // Cleanup
  execSync('git checkout package.json package-lock.json README.md && npm run build:clean', { stdio: 'inherit' });
}
