/**
 * Bumps PLUGIN_VERSION in code.js. Run before publishing the plugin so the
 * version badge in the UI identifies the build that is actually running
 * (Figma does not expose its auto-generated publish version to plugin code).
 *
 * Usage: node bump-version.js [major|minor|patch]  (default: patch)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const codePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'code.js');
const src = fs.readFileSync(codePath, 'utf8');

const match = src.match(/const PLUGIN_VERSION = '(\d+)\.(\d+)\.(\d+)'/);
if (!match) {
	console.error('PLUGIN_VERSION constant not found in code.js');
	process.exit(1);
}

const level = process.argv[2] || 'patch';
let [major, minor, patch] = match.slice(1).map(Number);

if (level === 'major') {
	major++; minor = 0; patch = 0;
} else if (level === 'minor') {
	minor++; patch = 0;
} else if (level === 'patch') {
	patch++;
} else {
	console.error(`Unknown bump level "${level}" — use major, minor or patch`);
	process.exit(1);
}

const current = match.slice(1).join('.');
const next = `${major}.${minor}.${patch}`;

fs.writeFileSync(codePath, src.replace(match[0], `const PLUGIN_VERSION = '${next}'`));
console.log(`PLUGIN_VERSION: ${current} -> ${next}`);
