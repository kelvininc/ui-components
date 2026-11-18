import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import jsdoc from 'eslint-plugin-jsdoc';
import tsdoc from 'eslint-plugin-tsdoc';

import {
	DOCUMENTATION_EXCLUDES,
	PARSER_PACKAGES
} from './documentation-config.mjs';
import { gitPaths, listChanges, readRanges } from './files.mjs';

const root = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../..'
);
const require = createRequire(
	new URL('../../packages/ui-components/package.json', import.meta.url)
);
const { Linter } = require('eslint');

/** Resolve an existing workspace parser without depending on a hoisted transitive path. */
const loadParser = () => {
	for (const filename of PARSER_PACKAGES) {
		const from = createRequire(realpathSync(path.join(root, filename)));

		try {
			return from('@typescript-eslint/parser');
		} catch (error) {
			if (error.code !== 'MODULE_NOT_FOUND') {
				throw error;
			}
		}
	}
	throw new Error(
		'Install the locked workspace dependencies before running lint:docs.'
	);
};

const parser = loadParser();
const publicKinds = new Set([
	'TSEnumDeclaration',
	'TSInterfaceDeclaration',
	'TSTypeAliasDeclaration',
	'VariableDeclaration'
]);
const publicContexts = [
	...publicKinds,
	'TSPropertySignature',
	'TSMethodSignature',
	'TSEnumMember'
];
const contexts = [
	'FunctionDeclaration',
	'ArrowFunctionExpression[parent.type="VariableDeclarator"]',
	'FunctionExpression[parent.type="VariableDeclarator"]',
	'ClassDeclaration',
	'MethodDefinition',
	'Property[method=true]',
	'PropertyDefinition[accessibility!="private"][key.type!="PrivateIdentifier"]',
	...publicContexts,
	'ExportNamedDeclaration[declaration.type="VariableDeclaration"]'
];

/** Associate separately exported local names with the statements that expose them. */
const getLocalExports = (source) => {
	const exports = new Map();

	for (const statement of source.ast.body) {
		const names = [];

		if (statement.type === 'ExportNamedDeclaration' && !statement.source) {
			names.push(
				...statement.specifiers.map((specifier) => specifier.local.name)
			);
		}

		if (
			statement.type === 'ExportDefaultDeclaration' &&
			statement.declaration.type === 'Identifier'
		) {
			names.push(statement.declaration.name);
		}

		for (const name of names) {
			const statements = exports.get(name) ?? [];

			statements.push(statement);
			exports.set(name, statements);
		}
	}

	return exports;
};

/** Match a top-level declaration to its exported local bindings, including constants. */
const hasExportedBinding = (node, names, source) =>
	source.scopeManager
		.getDeclaredVariables(node)
		.some((binding) => names.has(binding.name));

/** Keep JSDoc's reporting while selecting public contracts through this module's exports. */
const requireDocumentation = {
	...jsdoc.rules['require-jsdoc'],
	/** Resolve local export aliases once, then check each public declaration and member. */
	create(context) {
		const visitors = jsdoc.rules['require-jsdoc'].create(context);
		const source = context.sourceCode ?? context.getSourceCode();
		const exportedNames = getLocalExports(source);
		const publicDeclarations = new Set();

		for (const statement of source.ast.body) {
			if (publicKinds.has(statement.declaration?.type)) {
				publicDeclarations.add(statement.declaration);
			}

			if (
				publicKinds.has(statement.type) &&
				hasExportedBinding(statement, exportedNames, source)
			) {
				publicDeclarations.add(statement);
			}
		}

		for (const selector of publicContexts) {
			const visit = visitors[selector];

			visitors[selector] = (node) => {
				// The export visitor owns directly exported constants and their leading docblock.
				if (
					node.type === 'VariableDeclaration' &&
					node.parent.type === 'ExportNamedDeclaration'
				) {
					return;
				}

				let owner = node;

				while (owner && !publicKinds.has(owner.type)) {
					owner = owner.parent;
				}

				if (publicDeclarations.has(owner)) {
					visit(node);
				}
			};
		}

		return visitors;
	}
};

/** Include authored JS/TS only; generated sources and dependency/build directories have separate owners. */
export const isAuthored = (filename) =>
	/\.(?:[cm]?js|jsx|tsx?)$/.test(filename) &&
	!/(?:^|\/)(?:node_modules|dist|build|coverage|\.next|\.git|\.worktrees|generated)(?:\/|$)|\.d\.ts$/.test(
		filename
	) &&
	!DOCUMENTATION_EXCLUDES.some((pattern) => pattern.test(filename));

/**
 * Check source docblocks, including the full contract for functions in utility modules.
 * @param {string} filename - Repository-relative authored source path.
 * @param {string} text - Current source content, including unstaged edits.
 * @param {ChangedRange[]} [ranges] - Changed line ranges from `files.mjs`; omit to inspect every unit.
 * @returns {object[]} ESLint diagnostics for selected units and directly changed comments.
 * @example
 * checkDocumentation('src/utils.ts', source, [{ from: 12, to: 15 }]);
 */
export const checkDocumentation = (filename, text, ranges) => {
	const lint = new Linter({ configType: 'eslintrc' });

	lint.defineParser('workspace-typescript', parser);

	for (const [name, rule] of Object.entries(jsdoc.rules)) {
		lint.defineRule(
			`jsdoc/${name}`,
			name === 'require-jsdoc' ? requireDocumentation : rule
		);
	}
	lint.defineRule('tsdoc/syntax', tsdoc.rules.syntax);
	const utility =
		/(?:^|\/)(?:utils?|helpers?)(?:\.(?:client|server))?(?:\.[cm]?[jt]sx?|\/)|\.(?:utils?|helpers?)(?:\.(?:client|server))?\.[jt]sx?$/.test(
			filename
		);
	const isTypeScript = /\.tsx?$/.test(filename);
	const messages = lint.verify(
		text,
		{
			parser: 'workspace-typescript',
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: { jsx: true }
			},
			settings: {
				jsdoc: { mode: isTypeScript ? 'typescript' : 'jsdoc' }
			},
			rules: {
				'jsdoc/require-jsdoc': [
					'error',
					{ contexts, require: { FunctionDeclaration: false } }
				],
				'jsdoc/require-description': 'error',
				'jsdoc/check-param-names': 'error',
				'jsdoc/valid-types': 'error',
				'jsdoc/check-tag-names': [
					'error',
					{
						definedTags: [
							'Prop',
							'Event',
							'Method',
							'State',
							'Element',
							'Watch',
							'Listen',
							'Component',
							'cssprop',
							'slot',
							'part'
						]
					}
				],
				'jsdoc/require-param': utility ? 'error' : 'off',
				'jsdoc/require-param-description': utility ? 'error' : 'off',
				'jsdoc/require-returns': utility ? 'error' : 'off',
				'jsdoc/require-returns-description': utility ? 'error' : 'off',
				'jsdoc/require-example': utility ? 'error' : 'off',
				'tsdoc/syntax': isTypeScript ? 'error' : 'off'
			}
		},
		{ filename: path.join(root, filename), allowInlineConfig: false }
	);

	if (!ranges || messages.some((message) => message.fatal)) {
		return messages;
	}

	const source = lint.getSourceCode();
	const units = [];
	const changedExports = new Set();

	// Export-only edits make the referenced declaration a changed public contract.
	for (const [name, statements] of getLocalExports(source)) {
		if (
			statements.some((statement) =>
				ranges.some(
					({ from, to, deletion }) =>
						!deletion &&
						statement.loc.start.line <= to &&
						statement.loc.end.line >= from
				)
			)
		) {
			changedExports.add(name);
		}
	}

	// A body edit also selects its declaration's earlier docblock. Looking only at the
	// diagnostic line would let an undocumented function pass when its implementation changes.
	/** Collect declaration boundaries so a body edit also validates its preceding docblock. */
	const visit = (node) => {
		if (
			[
				'FunctionDeclaration',
				'FunctionExpression',
				'ArrowFunctionExpression',
				'ClassDeclaration',
				'Property',
				'PropertyDefinition',
				'TSPropertySignature',
				'TSMethodSignature',
				'TSEnumMember',
				'TSEnumDeclaration',
				'MethodDefinition',
				'TSInterfaceDeclaration',
				'TSTypeAliasDeclaration',
				'VariableDeclaration'
			].includes(node.type)
		) {
			let owner = node;

			while (
				[
					'VariableDeclarator',
					'VariableDeclaration',
					'ExportNamedDeclaration',
					'ExportDefaultDeclaration',
					'MethodDefinition'
				].includes(owner.parent?.type)
			) {
				owner = owner.parent;
			}
			const comment = source.getCommentsBefore(owner).at(-1);
			const start = comment?.loc.start.line ?? owner.loc.start.line;

			// Editing an export header changes the whole public contract; member edits stay scoped.
			if (
				['ExportNamedDeclaration', 'ExportDefaultDeclaration'].includes(
					owner.type
				) &&
				publicKinds.has(node.type) &&
				ranges.some(
					({ from, to, deletion }) =>
						!deletion &&
						owner.loc.start.line <= to &&
						(node.id?.loc.end.line ?? node.loc.start.line) >= from
				)
			) {
				units.push({ from: start, to: owner.loc.end.line });
			}

			if (
				owner.parent?.type === 'Program' &&
				hasExportedBinding(owner, changedExports, source)
			) {
				units.push({ from: start, to: owner.loc.end.line });
			}

			if (
				ranges.some(({ from, to, deletion, docblockOnly }) => {
					if (
						!deletion &&
						start <= to &&
						owner.loc.end.line >= from
					) {
						return true;
					}

					// Preserve the owner of a removed docblock, including replacement by blank lines.
					const followingLine = deletion ? to : to + 1;

					return (
						(deletion &&
							start <= from &&
							owner.loc.end.line >= to) ||
						(docblockOnly &&
							owner.loc.start.line >= followingLine &&
							source.lines
								.slice(
									followingLine - 1,
									owner.loc.start.line - 1
								)
								.every((line) => line.trim() === ''))
					);
				})
			) {
				units.push({ from: start, to: owner.loc.start.line });
			}
		}

		for (const key of source.visitorKeys[node.type] ?? []) {
			const children = node[key];

			for (const child of Array.isArray(children)
				? children
				: [children]) {
				if (child?.type) {
					visit(child);
				}
			}
		}
	};

	visit(source.ast);

	return messages.filter((message) =>
		[...ranges.filter((range) => !range.deletion), ...units].some(
			({ from, to }) => message.line >= from && message.line <= to
		)
	);
};

/**
 * Check changed authored units, or report the existing backlog when requested.
 * @param {string[]} args - File paths or --base, --all and --inventory options.
 * @param {string} [cwd] - Repository root; defaults to this script's repository.
 * @returns {number} One for findings, zero for success or an explicitly requested inventory.
 * @example
 * main(['--base', 'origin/dev']);
 */
export const main = (args, cwd = root) => {
	let base = 'HEAD~0';
	let all = false;
	let inventory = false;
	const explicit = [];

	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];

		if (arg === '--base') {
			base = args[++index];

			if (!base || base.startsWith('-')) {
				throw new Error('--base requires a Git reference.');
			}
		} else if (arg === '--all') {
			all = true;
		} else if (arg === '--inventory') {
			all = true;
			inventory = true;
		} else if (arg.startsWith('-')) {
			throw new Error(`Unknown argument: ${arg}`);
		} else {
			explicit.push(arg);
		}
	}
	const ancestor = execFileSync('git', ['merge-base', 'HEAD', base], {
		cwd,
		encoding: 'utf8'
	}).trim();
	const untracked = gitPaths(cwd, [
		'ls-files',
		'--others',
		'--exclude-standard',
		'-z'
	]);

	// Only existing authored units inherit documentation history through a rename.
	const changedFiles =
		!all && !explicit.length
			? listChanges(cwd, ancestor, isAuthored)
			: new Map();

	const selected = explicit.length
		? explicit
		: [
			...(all ? gitPaths(cwd, ['ls-files', '-z']) : changedFiles.keys()),
			...untracked
		];
	const files = [...new Set(selected)].filter(isAuthored).sort();
	const results = [];

	for (const filename of files) {
		const target = path.resolve(cwd, filename);

		if (!target.startsWith(`${path.resolve(cwd)}${path.sep}`)) {
			throw new Error(`Path outside repository: ${filename}`);
		}

		if (!existsSync(target)) {
			continue;
		}
		const ranges =
			all || explicit.length || untracked.includes(filename)
				? undefined
				: readRanges(cwd, ancestor, changedFiles.get(filename));
		const messages = checkDocumentation(
			filename,
			readFileSync(target, 'utf8'),
			ranges
		);

		if (messages.length) {
			results.push({ file: filename, messages });
		}
	}
	const count = results.reduce((sum, item) => sum + item.messages.length, 0);

	if (inventory) {
		console.log(
			JSON.stringify(
				{
					base: ancestor,
					files: files.length,
					findings: count,
					byFile: results.map(({ file, messages }) => ({
						file,
						findings: messages.length
					}))
				},
				null,
				2
			)
		);
	} else {
		for (const { file, messages } of results) {
			for (const item of messages) {
				console.error(
					`${file}:${item.line}:${item.column} ${item.ruleId ?? 'parse'}: ${item.message}`
				);
			}
		}
		console.log(
			`Source documentation: ${files.length} files; ${count} findings.`
		);
	}

	return inventory ? 0 : count ? 1 : 0;
};

if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	try {
		process.exitCode = main(process.argv.slice(2));
	} catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	}
}
