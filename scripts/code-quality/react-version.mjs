import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react18 from './react18.cjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(
	new URL('../../packages/react-ui-components/package.json', import.meta.url)
);
const { Linter } = require('eslint');
const linter = new Linter({ configType: 'eslintrc' });

linter.defineParser('typescript', require('@typescript-eslint/parser'));
linter.defineRule('react18', react18);
const files = execFileSync(
	'git',
	[
		'ls-files',
		'--cached',
		'--others',
		'--exclude-standard',
		'-z',
		'packages/react-ui-components/src'
	],
	{ cwd: root, encoding: 'utf8' }
)
	.split('\0')
	.filter(
		(file) =>
			/\.tsx?$/.test(file) &&
			!file.includes('/stencil-generated/') &&
			!file.endsWith('.d.ts') &&
			existsSync(path.join(root, file))
	);
let count = 0;

for (const file of files) {
	const messages = linter.verify(
		readFileSync(path.join(root, file), 'utf8'),
		{
			parser: 'typescript',
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: { jsx: true }
			},
			rules: { react18: 'error' }
		},
		{ filename: file }
	);

	for (const message of messages) {
		console.error(`${file}:${message.line} ${message.message}`);
	}
	count += messages.length;
}
console.log(
	`React 18 API check: ${files.length} authored files; ${count} findings.`
);
process.exitCode = count ? 1 : 0;
