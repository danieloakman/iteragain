import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

try {
  execSync('npm run build:clean && npm run build:es', { stdio: 'inherit' });

  const packageJSONPath = join(__dirname, '../package.json');
  const packageLockJSONPath = join(__dirname, '../package-lock.json');
  const packageJSON = JSON.parse(readFileSync(packageJSONPath, 'utf8'));
  const packageLockJSON = JSON.parse(readFileSync(packageLockJSONPath, 'utf8'));
  packageJSON.name = packageLockJSON.name = 'iteragain-es';
  packageJSON.type = 'module';
  packageJSON.scripts.prepare = packageJSON.scripts.prepare.replace('npm run build', 'npm run build:es');
  writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2));
  writeFileSync(packageLockJSONPath, JSON.stringify(packageLockJSON, null, 2));

  execSync('npm publish', { stdio: 'inherit' });
} finally {
  // Cleanup
  execSync('git checkout package.json package-lock.json && npm run build:clean', { stdio: 'inherit' });
}
