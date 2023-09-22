import { readFile, readdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { sh, ok, main } from 'js-utils';
import { execSync } from 'child_process';

async function readJSONFile(path: string) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function assertDirContainsJSFiles(dir: string) {
  const files = await readdir(dir);
  if (!files.some(p => p.endsWith('.js')))
    throw new Error(`No compiled JS files found in "${dir}" folder. Build failed.`);
}

main(module, async () => {
  try {
    const distDir = join(__dirname, '../');

    // Test and lint:
    ok(await sh('pnpm run check && pnpm run coverage && pnpm run lint'));

    // Clean, Build and Publish for common JS version ("iteragain"):
    ok(await sh('pnpm run build:clean && pnpm run build'));

    assertDirContainsJSFiles(distDir);

    // ok(await sh('pnpm publish'));
    execSync('pnpm publish', { stdio: 'inherit' });

    // Clean, Build for ES modules:
    ok(await sh('pnpm run build:clean && pnpm run build:es'));

    assertDirContainsJSFiles(distDir);

    // Modify package.json and package-lock.json for ES modules version ("iteragain-es") publish:
    const packageJSONPath = join(__dirname, '../package.json');
    const packageLockJSONPath = join(__dirname, '../package-lock.json');
    const packageJSON = await readJSONFile(packageJSONPath);
    const packageLockJSON = await readJSONFile(packageLockJSONPath);
    const readmePath = join(__dirname, '../README.md');
    const readmeESPath = join(__dirname, '../README.es.md');
    packageJSON.name = packageLockJSON.name = 'iteragain-es';
    packageJSON.type = 'module';
    packageJSON.homepage += '-es';
    packageJSON.sideEffects = false;
    await writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 2));
    await writeFile(packageLockJSONPath, JSON.stringify(packageLockJSON, null, 2));
    await writeFile(readmePath, await readFile(readmeESPath, 'utf8'));

    // ok(await sh('pnpm publish --no-git-checks'));
    execSync('pnpm publish --no-git-checks', { stdio: 'inherit' });
  } finally {
    // Cleanup
    ok(await sh('git checkout package.json package-lock.json README.md && pnpm run build:clean'));
  }
});
