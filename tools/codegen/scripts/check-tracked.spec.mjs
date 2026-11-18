import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { checkTracked } from './check-tracked.mjs';

test('should reject staged drift, untracked and missing catalogs after generation', () => {
	const root = mkdtempSync(path.join(tmpdir(), 'catalog-git-'));
	/** Execute Git inside the disposable fixture without touching the working repository. */
	const git = (...args) =>
		execFileSync('git', args, { cwd: root, stdio: 'pipe' });
	const file = path.join(root, 'API.md');

	try {
		git('init', '-q');
		git('config', 'user.name', 'Fixture');
		git('config', 'user.email', 'fixture@example.invalid');
		writeFileSync(file, 'initial');
		git('add', '.');
		git('-c', 'commit.gpgsign=false', 'commit', '-qm', 'fixture');
		checkTracked(root, ['API.md']);
		writeFileSync(file, 'changed');
		assert.throws(() => checkTracked(root, ['API.md']));
		git('add', 'API.md');
		assert.throws(() => checkTracked(root, ['API.md']));
		writeFileSync(file, 'initial');
		assert.throws(() => checkTracked(root, ['API.md']));
		writeFileSync(path.join(root, 'manifest.json'), '{}');
		assert.throws(() => checkTracked(root, ['manifest.json']));
		assert.throws(
			() => checkTracked(root, ['missing.md']),
			/Missing generated catalog/
		);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
