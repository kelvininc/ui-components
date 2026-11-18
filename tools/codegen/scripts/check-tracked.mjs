import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Require every expected generated artifact in Git, including unchanged staged content. */
export const checkTracked = (root, files) => {
	for (const file of files) {
		if (!existsSync(path.join(root, file))) {
			throw new Error(`Missing generated catalog: ${file}`);
		}
	}

	execFileSync('git', ['ls-files', '--error-unmatch', '--', ...files], {
		cwd: root,
		stdio: 'pipe'
	});
	execFileSync(
		'git',
		['diff', '--cached', '--exit-code', 'HEAD', '--', ...files],
		{
			cwd: root,
			stdio: 'pipe'
		}
	);
	execFileSync('git', ['diff', '--exit-code', 'HEAD', '--', ...files], {
		cwd: root,
		stdio: 'pipe'
	});
};

if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	const root = path.resolve(
		path.dirname(fileURLToPath(import.meta.url)),
		'../../..'
	);
	const files = [
		'PACKAGES.md',
		...['ui-components', 'react-ui-components'].flatMap((name) => [
			`packages/${name}/API.md`,
			`packages/${name}/manifest.json`
		])
	];

	try {
		checkTracked(root, files);
		console.log(
			`Verified ${files.length} generated catalogs against HEAD.`
		);
	} catch (error) {
		console.error(
			'Generated catalogs are missing, untracked or different from HEAD. Regenerate and include them in the change.'
		);
		console.error(
			error.stdout?.toString() ||
				error.stderr?.toString() ||
				error.message
		);
		process.exitCode = 1;
	}
}
