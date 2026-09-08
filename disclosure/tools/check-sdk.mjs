// Runs the published SDK fixture suite; does not issue or admit proof objects.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const require = createRequire(import.meta.url);
try {
 const packagePath = require.resolve('@receiz/sdk/package.json');
 const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
 if (pkg.version !== '126.0.0') throw new Error('Expected @receiz/sdk 126.0.0');
 const result = spawnSync(process.execPath, [path.join(path.dirname(packagePath), pkg.bin.receiz), 'conformance'], { stdio: 'inherit' });
 if (result.error) throw result.error;
 process.exitCode = result.status ?? 1;
} catch (error) { console.error(error.message); process.exitCode = 1; }
