import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { renderPackageMap } from './package-map.mjs';

test('should preserve the actual README filename case in package links', () => {
	const root = mkdtempSync(path.join(tmpdir(), 'package-map-'));

	try {
		for (const [name, readme] of [
			['lower', 'readme.md'],
			['upper', 'README.md']
		]) {
			const dir = path.join(root, 'packages', name);

			mkdirSync(dir, { recursive: true });
			writeFileSync(
				path.join(dir, 'package.json'),
				JSON.stringify({ name })
			);
			writeFileSync(path.join(dir, readme), '# Package');
		}

		const markdown = renderPackageMap(root);

		assert.match(markdown, /\[readme.md\]\(packages\/lower\/readme.md\)/);
		assert.match(markdown, /\[README.md\]\(packages\/upper\/README.md\)/);
		assert.doesNotMatch(markdown, /packages\/lower\/README.md/);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
