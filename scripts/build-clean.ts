/** Brute force way to make sure all compiled ts files are removed. `tsc --build --clean` didn't always work as intended. */

import { walkdirSync } from 'more-node-fs';
import { unlinkSync } from 'fs';
import { join } from 'path';
for (const { path, stats } of walkdirSync(join(__dirname, '../'), { ignore: /node_modules/i }))
  if (stats.isFile() && /(\.d\.ts|\.js|\.map)$/.test(path)) unlinkSync(path);
